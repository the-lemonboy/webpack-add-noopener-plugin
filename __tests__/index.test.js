const AddNoopenerPlugin = require('../src/index');

describe('AddNoopenerPlugin', () => {
  let plugin;
  let mockCompilation;
  let mockCompiler;

  beforeEach(() => {
    plugin = new AddNoopenerPlugin();
    
    mockCompilation = {
      assets: {}
    };

    mockCompiler = {
      hooks: {
        emit: {
          tapAsync: jest.fn((name, callback) => {
            callback(mockCompilation, jest.fn());
          })
        }
      }
    };
  });

  describe('构造函数', () => {
    it('应该使用默认选项', () => {
      const defaultPlugin = new AddNoopenerPlugin();
      expect(defaultPlugin.options.verbose).toBe(false);
      expect(defaultPlugin.options.extensions).toEqual(['.html']);
    });

    it('应该接受自定义选项', () => {
      const customPlugin = new AddNoopenerPlugin({
        verbose: true,
        extensions: ['.html', '.htm']
      });
      expect(customPlugin.options.verbose).toBe(true);
      expect(customPlugin.options.extensions).toEqual(['.html', '.htm']);
    });
  });

  describe('processHTML', () => {
    it('应该为没有 rel 属性的 <a target="_blank"> 添加 rel="noopener"', () => {
      const html = '<a href="https://example.com" target="_blank">链接</a>';
      const result = plugin.processHTML(html, 'test.html');
      expect(result).toContain('rel="noopener"');
      expect(result).toContain('target="_blank"');
    });

    it('应该为已有 rel 属性的 <a target="_blank"> 添加 noopener', () => {
      const html = '<a href="https://example.com" target="_blank" rel="nofollow">链接</a>';
      const result = plugin.processHTML(html, 'test.html');
      expect(result).toContain('rel="nofollow noopener"');
    });

    it('不应该重复添加 noopener', () => {
      const html = '<a href="https://example.com" target="_blank" rel="noopener">链接</a>';
      const result = plugin.processHTML(html, 'test.html');
      const noopenerCount = (result.match(/noopener/g) || []).length;
      expect(noopenerCount).toBe(1);
    });

    it('应该处理多个 <a> 标签', () => {
      const html = `
        <a href="https://example.com" target="_blank">链接1</a>
        <a href="https://example.org" target="_blank" rel="nofollow">链接2</a>
      `;
      const result = plugin.processHTML(html, 'test.html');
      expect(result).toContain('rel="noopener"');
      expect(result).toContain('rel="nofollow noopener"');
    });

    it('不应该处理没有 target="_blank" 的 <a> 标签', () => {
      const html = '<a href="https://example.com">链接</a>';
      const result = plugin.processHTML(html, 'test.html');
      expect(result).not.toContain('noopener');
    });

    it('应该处理完整的 HTML 文档', () => {
      const html = `
        <!DOCTYPE html>
        <html>
        <head><title>Test</title></head>
        <body>
          <a href="https://example.com" target="_blank">链接</a>
        </body>
        </html>
      `;
      const result = plugin.processHTML(html, 'test.html');
      expect(result).toContain('rel="noopener"');
      expect(result).toContain('<!DOCTYPE html>');
    });

    it('应该处理只有 body 内容的 HTML', () => {
      const html = '<div><a href="https://example.com" target="_blank">链接</a></div>';
      const result = plugin.processHTML(html, 'test.html');
      expect(result).toContain('rel="noopener"');
    });

    it('应该处理复杂的 rel 属性值', () => {
      const html = '<a href="https://example.com" target="_blank" rel="nofollow noreferrer">链接</a>';
      const result = plugin.processHTML(html, 'test.html');
      expect(result).toContain('rel="nofollow noreferrer noopener"');
    });

    it('应该处理带有多个空格的 rel 属性', () => {
      const html = '<a href="https://example.com" target="_blank" rel="nofollow   noreferrer">链接</a>';
      const result = plugin.processHTML(html, 'test.html');
      expect(result).toContain('noopener');
    });
  });

  describe('文件扩展名过滤', () => {
    it('应该处理 .html 文件', () => {
      mockCompilation.assets = {
        'test.html': {
          source: () => '<a href="https://example.com" target="_blank">链接</a>'
        }
      };
      plugin.apply(mockCompiler);
      expect(mockCompilation.assets['test.html'].source()).toContain('rel="noopener"');
    });

    it('不应该处理 .js 文件', () => {
      mockCompilation.assets = {
        'test.js': {
          source: () => 'console.log("test");'
        }
      };
      plugin.apply(mockCompiler);
      expect(mockCompilation.assets['test.js'].source()).toBe('console.log("test");');
    });

    it('应该处理自定义扩展名', () => {
      const customPlugin = new AddNoopenerPlugin({
        extensions: ['.html', '.htm']
      });
      mockCompilation.assets = {
        'test.html': {
          source: () => '<a href="https://example.com" target="_blank">链接</a>'
        },
        'test.htm': {
          source: () => '<a href="https://example.com" target="_blank">链接</a>'
        },
        'test.js': {
          source: () => 'console.log("test");'
        }
      };
      customPlugin.apply(mockCompiler);
      expect(mockCompilation.assets['test.html'].source()).toContain('rel="noopener"');
      expect(mockCompilation.assets['test.htm'].source()).toContain('rel="noopener"');
      expect(mockCompilation.assets['test.js'].source()).toBe('console.log("test");');
    });
  });

  describe('apply 方法', () => {
    it('应该注册到 webpack emit hook', () => {
      plugin.apply(mockCompiler);
      expect(mockCompiler.hooks.emit.tapAsync).toHaveBeenCalledWith(
        'AddNoopenerPlugin',
        expect.any(Function)
      );
    });

    it('应该处理资源文件', () => {
      mockCompilation.assets = {
        'test.html': {
          source: () => '<a href="https://example.com" target="_blank">链接</a>'
        }
      };

      plugin.apply(mockCompiler);
      
      const processedAsset = mockCompilation.assets['test.html'];
      expect(processedAsset).toBeDefined();
      const content = processedAsset.source();
      expect(content).toContain('rel="noopener"');
    });

    it('应该跳过非 HTML 文件', () => {
      mockCompilation.assets = {
        'test.js': {
          source: () => 'console.log("test");'
        },
        'test.html': {
          source: () => '<a href="https://example.com" target="_blank">链接</a>'
        }
      };

      plugin.apply(mockCompiler);
      
      expect(mockCompilation.assets['test.js'].source()).toBe('console.log("test");');
      expect(mockCompilation.assets['test.html'].source()).toContain('rel="noopener"');
    });

    it('应该处理函数形式的 source', () => {
      mockCompilation.assets = {
        'test.html': {
          source: function() {
            return '<a href="https://example.com" target="_blank">链接</a>';
          }
        }
      };

      plugin.apply(mockCompiler);
      
      const processedAsset = mockCompilation.assets['test.html'];
      const content = processedAsset.source();
      expect(content).toContain('rel="noopener"');
    });

    it('应该正确处理错误', () => {
      const errorCallback = jest.fn();
      mockCompilation.assets = {
        'test.html': {
          source: () => {
            throw new Error('Test error');
          }
        }
      };

      mockCompiler.hooks.emit.tapAsync = jest.fn((name, callback) => {
        try {
          callback(mockCompilation, errorCallback);
        } catch (error) {
          errorCallback(error);
        }
      });

      plugin.apply(mockCompiler);
      expect(errorCallback).toHaveBeenCalled();
    });
  });

  describe('verbose 模式', () => {
    it('应该在 verbose 模式下输出日志', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const verbosePlugin = new AddNoopenerPlugin({ verbose: true });
      
      const html = '<a href="https://example.com" target="_blank">链接</a>';
      verbosePlugin.processHTML(html, 'test.html');
      
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('不应该在非 verbose 模式下输出日志', () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const silentPlugin = new AddNoopenerPlugin({ verbose: false });
      
      const html = '<a href="https://example.com" target="_blank">链接</a>';
      silentPlugin.processHTML(html, 'test.html');
      
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});

