/*!
 * 版权保护模块 — 《文章与思辨合集》
 * © 2026 Chengxin Zeng. 保留所有权利 / All rights reserved.
 * 本文件内容与站内全部文章均受著作权法保护，未经授权不得转载、改编或商用。
 */
(function () {
  'use strict';

  /* ==================== 可调开关（改这里就够了） ==================== */
  var CONFIG = {
    author:   'Chengxin Zeng',
    siteName: '文章与思辨合集',
    year:     '2026',
    license:  'CC BY-NC-ND 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-nc-nd/4.0/deed.zh',

    // 授权域名白名单。留空数组 = 不做域名校验（默认，最安全不误伤）。
    // 想开启防扒站提示，把你的正式域名填进去，例如：['cx-0.netlify.app']
    allowedHosts: ['cx-06.netlify.app', 'main--cx-06.netlify.app'],

    showFooter:        true,  // 底部版权声明（跟随现有配色，不改观感）
    copyAttribution:   true,  // 复制超过一定长度时自动附带出处
    minCopyLength:     40,    // 触发附带出处的最小字数
    hiddenWatermark:   true,  // 隐藏署名水印（读者看不见，扒站会一起被带走）
    antiFrame:         true,  // 防止被别人 iframe 套壳
    consoleNotice:     true,  // 控制台版权警告

    // 以下为「硬性防复制」，默认关闭：它们会明显影响正常读者的体验
    // （无法引用、无法右键、影响无障碍阅读），而且懂技术的人几分钟就能绕过。
    disableContextMenu:  false, // 禁用右键菜单
    disableSelection:    false, // 禁止选中文本
    disableDevtoolsKeys: false, // 屏蔽 F12 / Ctrl+U / Ctrl+Shift+I
    disableImageDrag:    true   // 禁止拖拽图片另存（体验无感，保留开启）
  };
  /* ================================================================ */

  var NOTICE = '© ' + CONFIG.year + ' ' + CONFIG.author + ' · 《' + CONFIG.siteName + '》保留所有权利';

  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* ---------- 1. 元信息：作者 / 版权 / 许可协议 ---------- */
  function injectMeta() {
    var metas = [
      ['author', CONFIG.author],
      ['copyright', NOTICE],
      ['rights', NOTICE]
    ];
    metas.forEach(function (m) {
      if (document.querySelector('meta[name="' + m[0] + '"]')) return;
      var el = document.createElement('meta');
      el.setAttribute('name', m[0]);
      el.setAttribute('content', m[1]);
      document.head.appendChild(el);
    });
    if (!document.querySelector('link[rel="license"]')) {
      var lk = document.createElement('link');
      lk.setAttribute('rel', 'license');
      lk.setAttribute('href', CONFIG.licenseUrl);
      document.head.appendChild(lk);
    }
    // 结构化数据：便于搜索引擎与转载平台识别著作权人
    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: CONFIG.siteName,
      author: { '@type': 'Person', name: CONFIG.author },
      copyrightHolder: { '@type': 'Person', name: CONFIG.author },
      copyrightYear: CONFIG.year,
      license: CONFIG.licenseUrl
    });
    document.head.appendChild(ld);
  }

  /* ---------- 2. 底部版权声明（沿用站点配色，不破坏观感） ---------- */
  function injectFooter() {
    if (!CONFIG.showFooter) return;
    var bar = document.createElement('div');
    bar.id = 'copyright-notice';
    bar.setAttribute('role', 'contentinfo');
    bar.innerHTML =
      NOTICE +
      '<br><span class="cr-sub">本站文章采用 <a href="' + CONFIG.licenseUrl +
      '" target="_blank" rel="license noopener">' + CONFIG.license +
      '</a> 协议 · 允许非商业转载并署名，禁止改编与商用；其他用途请先取得授权。</span>';

    var css = document.createElement('style');
    css.textContent =
      '#copyright-notice{margin:48px auto 32px;padding:18px 24px 0;max-width:760px;' +
      'border-top:1px solid var(--line,#e3ddd0);color:var(--muted,#6b6459);' +
      'font-size:13px;line-height:1.8;text-align:center;letter-spacing:.02em;}' +
      '#copyright-notice .cr-sub{font-size:12px;opacity:.85;}' +
      '#copyright-notice a{color:var(--accent,#a9782f);text-decoration:none;}' +
      '#copyright-notice a:hover{text-decoration:underline;}' +
      '@media(max-width:640px){#copyright-notice{padding:16px 18px 0;margin:32px auto 24px;}}';
    document.head.appendChild(css);

    var host = document.querySelector('footer') || document.querySelector('main') || document.body;
    host.appendChild(bar);
  }

  /* ---------- 3. 复制时自动附带出处 ---------- */
  function attachCopy() {
    if (!CONFIG.copyAttribution) return;
    document.addEventListener('copy', function (e) {
      var sel = window.getSelection();
      if (!sel) return;
      var text = String(sel);
      if (text.replace(/\s/g, '').length < CONFIG.minCopyLength) return; // 短句照常复制，不打扰

      var tail = '\n\n———\n本文出自《' + CONFIG.siteName + '》 · 作者：' + CONFIG.author +
                 '\n原文链接：' + location.href +
                 '\n' + NOTICE + '，转载请保留此声明。';
      try {
        e.clipboardData.setData('text/plain', text + tail);
        e.clipboardData.setData('text/html',
          '<div>' + text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>') +
          '</div><hr><p style="font-size:12px;color:#6b6459">本文出自《' + CONFIG.siteName +
          '》 · 作者：' + CONFIG.author + '<br>原文链接：<a href="' + location.href + '">' +
          location.href + '</a><br>' + NOTICE + '，转载请保留此声明。</p>');
        e.preventDefault();
      } catch (err) { /* 失败则退回浏览器默认复制行为 */ }
    });
  }

  /* ---------- 4. 隐藏署名水印（读者无感，扒站会连带被复制） ---------- */
  function watermark() {
    if (!CONFIG.hiddenWatermark) return;
    document.documentElement.setAttribute('data-copyright', NOTICE);
    document.documentElement.setAttribute('data-author', CONFIG.author);

    var mark = document.createElement('div');
    mark.setAttribute('aria-hidden', 'true');
    mark.style.cssText =
      'position:absolute!important;width:1px;height:1px;overflow:hidden;' +
      'clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;border:0;padding:0;margin:-1px;';
    mark.textContent = NOTICE + ' · 原站：' + location.host + ' · 若您在其他站点看到本文，即为未授权转载。';
    document.body.appendChild(mark);

    document.body.appendChild(document.createComment(
      ' ' + NOTICE + ' | 未经授权的转载、镜像与商用将被追究法律责任。 '));
  }

  /* ---------- 5. 防扒站 / 防套壳 ---------- */
  function antiClone() {
    if (CONFIG.antiFrame && window.top !== window.self) {
      var sameOrigin = false;
      try { sameOrigin = (window.top.location.host === location.host); } catch (err) { sameOrigin = false; }
      if (!sameOrigin) {
        try { window.top.location.href = location.href; }
        catch (err) { banner('本页面正被第三方网站嵌套显示。', location.href, '访问原文'); }
      }
    }
    if (CONFIG.allowedHosts.length &&
        CONFIG.allowedHosts.indexOf(location.hostname) === -1 &&
        !/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname)) {
      banner('您正在浏览的是未经授权的镜像站点，内容版权属于 ' + CONFIG.author + '。',
             'https://' + CONFIG.allowedHosts[0] + location.pathname, '前往官方原站');
    }
  }

  function banner(msg, href, linkText) {
    var b = document.createElement('div');
    b.style.cssText =
      'position:fixed;top:0;left:0;right:0;z-index:99999;padding:10px 16px;' +
      'background:#2a2622;color:#faf8f4;font-size:13px;line-height:1.6;text-align:center;' +
      'font-family:system-ui,-apple-system,sans-serif;';
    b.innerHTML = msg + ' <a href="' + href + '" style="color:#d8ab5c;text-decoration:underline">' +
                  linkText + ' →</a>';
    document.body.appendChild(b);
  }

  /* ---------- 6. 温和的防复制措施 ---------- */
  function guards() {
    if (CONFIG.disableImageDrag) {
      document.addEventListener('dragstart', function (e) {
        if (e.target && e.target.tagName === 'IMG') e.preventDefault();
      });
    }
    if (CONFIG.disableContextMenu) {
      document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        toast(NOTICE + '，请勿未经授权转载。');
      });
    }
    if (CONFIG.disableSelection) {
      var s = document.createElement('style');
      s.textContent = 'body{-webkit-user-select:none;user-select:none;}';
      document.head.appendChild(s);
    }
    if (CONFIG.disableDevtoolsKeys) {
      document.addEventListener('keydown', function (e) {
        var k = (e.key || '').toLowerCase();
        if (k === 'f12' ||
            ((e.ctrlKey || e.metaKey) && e.shiftKey && (k === 'i' || k === 'j' || k === 'c')) ||
            ((e.ctrlKey || e.metaKey) && (k === 'u' || k === 's'))) {
          e.preventDefault();
          toast('本站内容受版权保护。');
        }
      });
    }
  }

  var toastTimer = null;
  function toast(msg) {
    var el = document.getElementById('cr-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'cr-toast';
      el.style.cssText =
        'position:fixed;left:50%;bottom:32px;transform:translateX(-50%);z-index:99999;' +
        'background:rgba(42,38,34,.92);color:#faf8f4;padding:10px 18px;border-radius:6px;' +
        'font-size:13px;opacity:0;transition:opacity .25s ease;pointer-events:none;max-width:86vw;';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = '1';
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.style.opacity = '0'; }, 2200);
  }

  /* ---------- 7. 控制台声明 ---------- */
  function consoleNotice() {
    if (!CONFIG.consoleNotice) return;
    try {
      console.log('%c' + NOTICE,
        'font-size:14px;font-weight:700;color:#a9782f;padding:6px 0;');
      console.log('%c本站全部文字内容均为原创，受《中华人民共和国著作权法》及国际版权公约保护。\n' +
        '欢迎阅读与非商业署名转载（' + CONFIG.license + '）；禁止改编、商用、批量抓取与镜像。\n' +
        '授权与合作请联系作者。',
        'font-size:12px;color:#6b6459;line-height:1.8;');
    } catch (err) {}
  }

  /* ---------- 启动 ---------- */
  injectMeta();
  ready(function () {
    injectFooter();
    watermark();
    antiClone();
    guards();
    attachCopy();
    consoleNotice();
  });
})();
