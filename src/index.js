const cheerio = require('cheerio');

/**
 * Webpack 插件：为带有 target="_blank" 的 <a> 标签添加 rel="noopener"
 * 
 * @class AddNoopenerPlugin
 * @description 自动为所有带有 target="_blank" 的 <a> 标签添加 rel="noopener" 属性，提高安全性
 * 
 * @example
 * // webpack.config.js
 * const AddNoopenerPlugin = require('webpack-add-noopener-plugin');
 * 
 * module.exports = {
 *   plugins: [
 *     new AddNoopenerPlugin({
 *       verbose: true,
 *       extensions: ['.html']
 *     })
 *   ]
 * };
 */
class AddNoopenerPlugin {
  /**
   * @param {Object} options - 插件配置选项
   * @param {boolean} [options.verbose=false] - 是否在控制台输出处理信息
   * @param {string[]} [options.extensions=['.html']] - 要处理的文件扩展名数组
   */
  constructor(options = {}) {
    this.options = {
      verbose: options.verbose !== undefined ? options.verbose : false,
      extensions: options.extensions || ['.html'],
      ...options
    };
  }

  /**
   * Webpack 插件入口方法
   * @param {Object} compiler - Webpack compiler 实例
   */
  apply(compiler) {
    compiler.hooks.emit.tapAsync('AddNoopenerPlugin', (compilation, callback) => {
      try {
        this.processAssets(compilation);
        callback();
      } catch (error) {
        console.error('AddNoopenerPlugin 处理出错:', error);
        callback(error);
      }
    });
  }

  /**
   * 处理所有资源文件
   * @param {Object} compilation - Webpack compilation 实例
   * @private
   */
  processAssets(compilation) {
    Object.keys(compilation.assets).forEach(filename => {
      if (!this.shouldProcessFile(filename)) {
        return;
      }

      const asset = compilation.assets[filename];
      const htmlContent = this.getAssetContent(asset);
      const processedContent = this.processHTML(htmlContent, filename);
      
      this.updateAsset(compilation, filename, processedContent);
    });
  }

  /**
   * 检查文件是否应该被处理
   * @param {string} filename - 文件名
   * @returns {boolean} 是否应该处理
   * @private
   */
  shouldProcessFile(filename) {
    return this.options.extensions.some(ext => filename.endsWith(ext));
  }

  /**
   * 获取资源内容
   * @param {Object} asset - Webpack asset 对象
   * @returns {string} 资源内容
   * @private
   */
  getAssetContent(asset) {
    let source = asset.source();
    if (typeof source === 'function') {
      source = source();
    }
    return source.toString();
  }

  /**
   * 更新资源内容
   * @param {Object} compilation - Webpack compilation 实例
   * @param {string} filename - 文件名
   * @param {string} content - 新的内容
   * @private
   */
  updateAsset(compilation, filename, content) {
    compilation.assets[filename] = {
      source: () => content,
      size: () => Buffer.byteLength(content, 'utf8')
    };
  }

  /**
   * 处理 HTML 内容，为 <a> 标签添加 noopener
   * @param {string} htmlContent - HTML 内容
   * @param {string} filename - 文件名（用于日志）
   * @returns {string} 处理后的 HTML 内容
   * @public
   */
  processHTML(htmlContent, filename) {
    const isFullDocument = this.isFullHTMLDocument(htmlContent);
    const $ = cheerio.load(htmlContent, {
      decodeEntities: false,
      withStartIndices: false,
      withEndIndices: false
    });

    const processedCount = this.processAnchorTags($, filename);

    if (processedCount > 0 && this.options.verbose) {
      console.log(`[AddNoopenerPlugin] ${filename}: 共处理了 ${processedCount} 个 <a> 标签`);
    }

    return this.getOutputHTML($, isFullDocument, htmlContent);
  }

  /**
   * 检查是否是完整的 HTML 文档
   * @param {string} htmlContent - HTML 内容
   * @returns {boolean} 是否是完整文档
   * @private
   */
  isFullHTMLDocument(htmlContent) {
    return /^\s*<!DOCTYPE|^\s*<html/i.test(htmlContent);
  }

  /**
   * 处理所有带有 target="_blank" 的 <a> 标签
   * @param {Object} $ - Cheerio 实例
   * @param {string} filename - 文件名
   * @returns {number} 处理的标签数量
   * @private
   */
  processAnchorTags($, filename) {
    let processedCount = 0;

    $('a[target="_blank"]').each((index, element) => {
      const $a = $(element);
      const currentRel = $a.attr('rel');
      
      if (this.shouldAddNoopener(currentRel)) {
        this.addNoopener($a, currentRel);
        processedCount++;
        
        if (this.options.verbose) {
          const logMessage = currentRel
            ? `为 <a> 标签添加 noopener (已有 rel="${currentRel}")`
            : '为 <a> 标签添加 rel="noopener"';
          console.log(`[AddNoopenerPlugin] ${filename}: ${logMessage}`);
        }
      }
    });

    return processedCount;
  }

  /**
   * 检查是否应该添加 noopener
   * @param {string|null} currentRel - 当前的 rel 属性值
   * @returns {boolean} 是否应该添加
   * @private
   */
  shouldAddNoopener(currentRel) {
    if (!currentRel) {
      return true;
    }
    const relValues = currentRel.split(/\s+/).filter(v => v.trim());
    return !relValues.includes('noopener');
  }

  /**
   * 为 <a> 标签添加 noopener
   * @param {Object} $a - Cheerio <a> 元素
   * @param {string|null} currentRel - 当前的 rel 属性值
   * @private
   */
  addNoopener($a, currentRel) {
    if (currentRel) {
      $a.attr('rel', `${currentRel} noopener`);
    } else {
      $a.attr('rel', 'noopener');
    }
  }

  /**
   * 获取输出 HTML
   * @param {Object} $ - Cheerio 实例
   * @param {boolean} isFullDocument - 是否是完整文档
   * @param {string} originalContent - 原始内容
   * @returns {string} 输出 HTML
   * @private
   */
  getOutputHTML($, isFullDocument, originalContent) {
    if (isFullDocument) {
      return $.html();
    }
    
    // 检查原始内容是否有 <body> 标签
    const hasBodyTag = /<body[^>]*>/i.test(originalContent);
    
    if (hasBodyTag) {
      // 如果原始内容有 body 标签，返回 body 内容
      const bodyElement = $('body');
      if (bodyElement.length > 0) {
        return bodyElement.html() || '';
      }
    }
    
    // 如果没有 body 标签，说明是只有 body 内容的 HTML（如 BodyOnlyPlugin 生成的）
    // 格式可能是：<style>...</style><main>...</main><script>...</script>
    // cheerio 会将内容包装在 <html><head></head><body>...</body></html> 中
    // 并且会把 <style> 标签移到 <head> 中，把 <script> 标签留在 <body> 中
    // 我们需要提取所有内容，包括 head 中的 style 和 body 中的内容
    
    const root = $.root();
    
    // 检查 cheerio 是否自动添加了 html/head/body 结构
    const htmlElement = root.find('html');
    const headElement = root.find('head');
    const bodyElement = root.find('body');
    
    if (htmlElement.length > 0 || headElement.length > 0 || bodyElement.length > 0) {
      // cheerio 自动添加了结构
      // 提取 head 中的内容（包含 style 标签）
      let headContent = '';
      if (headElement.length > 0) {
        headContent = headElement.html() || '';
      }
      
      // 提取 body 中的内容（包含 script 标签和其他内容）
      let bodyContent = '';
      if (bodyElement.length > 0) {
        bodyContent = bodyElement.html() || '';
      }
      
      // 合并 head 和 body 内容
      // 原始格式是 <style>...</style><main>...</main><script>...</script>
      // cheerio 处理后变成 <head><style>...</style></head><body><main>...</main><script>...</script></body>
      // 所以我们需要 headContent + bodyContent 来恢复原始格式
      return headContent + bodyContent;
    }
    
    // 如果 cheerio 没有自动添加结构，直接获取根元素的所有子元素
    // 这样可以保留 style 和 script 标签
    const children = root.children();
    if (children.length > 0) {
      return children.map((i, el) => $.html(el)).get().join('');
    }
    
    // 如果都没有，返回原始内容
    return originalContent;
  }
}

module.exports = AddNoopenerPlugin;

