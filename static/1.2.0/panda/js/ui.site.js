//------------------------------------------------------
function s_onpageload() {
	//invoke onPageLoad function
	if (window.onPageLoad) {
		window.onPageLoad();
		window.onPageLoad = null;
	}

	for (var i = 1; ; i++) {
		var f = 'onPageLoad' + i;
		if (window[f]) {
			window[f]();
			window[f] = null;
		}
		else {
			break;
		}
	}
}

function s_totop() {
	$('.p-totop').click(function() {
		$('html,body').animate({ scrollTop: 0 }, 'slow');
	});
}

function s_preload() {
	$('body').append(
		'<div id="preload" class="p-dispear">'
			+ '<div class="ui-loadmask"></div>'
			+ '<div class="p-loader-fountain"></div>'
		+ '</div>');
}

function s_submit_form() {
	var form = this;
	var $f = $(form);
	var $c = $f.closest('.p-popup, .p-inner');
	var lm = ($f.height() > 20 && $f.attr('loadmask') != 'false');
	if ($c.length > 0) {
		setTimeout(function() {
			var data = $f.serializeArray();
			if ($c.hasClass('p-inner')) {
				data.push({ name: '__inner', value: 'true' });
			}
			else {
				data.push({ name: '__popup', value: 'true' });
			}
			if (lm) {
				$c.parent().loadmask();
			}
			$.ajax({
				url: form.action,
				data: data,
				dataType: 'html',
				success: function(html, ts, xhr) {
					$c.parent().html(html);
				},
				error: function(xhr, ts, err) {
					$c.parent().html(xhr.responseText);
				},
				complete: function(xhr, ts) {
					$c.parent().unloadmask();
				}
			});
		}, 10);
		return false;
	}
	else {
		if (lm) {
			$f.loadmask();
		}
		return true;
	}
}

function s_hook_forms($w) {
	$w.find('form[hooked!=true]').each(function() {
		var $t = $(this);
		$t.attr('hooked', 'true');
		if (this.target == '' || this.target == '_self'
			|| this.target == '_top' || this.target == '_parent') {
			$t.submit(s_submit_form);
		}
	});
}

function s_ie6_submit_onclick() {
	var t = this;
	$(this).closest('form').find('input[type=submit],button').each(function() {
		if (this != t) {
			this.disabled = true;
		}
	});
};

function s_ie6_hack_forms($w) {
	if ($.browser.msie && $.browser.majorVersion < 7) {
		$w.find('form[hacked!=true]')
			.find('button[type=submit]').each(function() {
				if (!this.onclick) {
					$(this).click(s_ie6_submit_onclick);
				}
			}).end()
			.attr('hacked', 'true');
	}
}

//------------------------------------------------------
function sl_sort(id, el) {
	var co = el.value.split(' ');
	if (co.length == 2) {
		$('#' + id + '_s_c').val(co[0]);
		$('#' + id + '_s_d').val(co[1]);
		// backward
		$('#' + id + '_so_c').val(co[0]);
		$('#' + id + '_so_d').val(co[1]);
		sl_submit(id);
	}
}
function sl_sorta(id, name, dir) {
	sl_sortn(id, name, dir.toLowerCase() == "asc" ? "desc" : "asc");
}
function sl_sortn(id, name, dir) {
	if (id == '') {
		s_loadmask();
		location.href = s_setQueryParam({ 's.c': name, 's.d': dir });
	}
	else {
		$('#' + id + '_s_c').val(name);
		$('#' + id + '_s_d').val(dir);
		// backward
		$('#' + id + '_so_c').val(name);
		$('#' + id + '_so_d').val(dir);

		sl_submit(id);
	}
}
function sl_goto(id, s) {
	if (id == '') {
		s_loadmask();
		location.href = s_setQueryParam({ 'p.s': s });
	}
	else {
		$('#' + id + '_p_s').val(s);
		// backward
		$('#' + id + '_pg_s').val(s);

		sl_submit(id);
	}
}
function sl_limit(id, el) {
	if (id == '') {
		s_loadmask();
		location.href = s_setQueryParam({ 'p.l': el.value });
	}
	else {
		$('#' + id + '_p_l').val(el.value);
		// backward
		$('#' + id + '_pg_l').val(el.value);

		sl_submit(id);
	}
}
function sl_submit(id) {
	var $f = $('#' + id);
	var $i = $f.closest('.p-inner');
	if ($i.size() > 0) {
		var d = $f.serializeArray();
		d[d.length] = { name: '__inner', value: 'true' };
		
		var $p = $i.parent();
		$p.loadmask({ cssClass: 'p-loader-fountain' });
		$p.load($f.attr('action'), d, function() {
				$p.unloadmask();
			});
	}
	else {
		s_loadmask();
		$f.submit();
	}
}

function s_loadmask() {
	$('body').loadmask({
		cssClass: 'p-loader-fountain',
		mask: false,
		window: true
	});
}

function s_resize() {
	$(window).trigger('resize');
}

function s_getLinkMark() {
	var i = location.href.lastIndexOf('#');
	if (i > 0) {
		return location.href.substring(i);
	}
	return "";
}

function s_setTitle(title) {
	var d = document.title.indexOf(' - ');
	if (d < 0) {
		d = document.title.indexOf(' | ');
	}
	document.title = title + (d < 0 ? '' : document.title.substring(d));
}

function s_setQueryParam(vs) {
	var ps;
	var u = location.href, i = u.indexOf('?');
	if (i >= 0) {
		ps = $.extend(u.queryParams(), vs);
		u = u.substring(0, i);
	}
	else {
		ps = vs;
	}
	var qs = $.param(ps);
	return u + '?' + qs;
}

function s_setLang(v) {
	location.href = s_setQueryParam({ '__locale': v });
}

function s_addScript(url) {
	$.jscript(url);
}

//------------------------------------------------------
// google analytics
function s_google_analytics(c) {
	if (c.google_analytics) {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

		ga('create', c.google_analytics, 'auto');
		ga('send', 'pageview');
	}
}

//------------------------------------------------------
// site vars
var site = {
	statics: '/static'
};

function s_setbase(c) {
	c = $.extend(site, c);
	$.cookie.defaults = c.cookie || {};
	return site;
}

//------------------------------------------------------
// clipboard
function s_copyToClipboard(s) {
	if (window.clipboardData) {
		// ie
		clipboardData.setData('Text', s);
		return;
	}

	var $t = $('<textarea>').css({ 'width' : '0px', 'height': '0px' }).html(s.escapeHtml());
	var l = $t.val().length;
	var t = $t.get(0);
	
	t.setSelectionRange(0, l);
	document.execCommand('copy');
	t.blur();
}

function s_copyToClipboardEx(s) {
	try {
		s_copyToClipboard(s);
	}
	catch (e) {
		var swf = document.createElement('embed');
		swf.src = site.statics + "/panda/swf/clipboard.swf";
		swf.setAttribute('FlashVars','code=' + encodeURIComponent(s));
		swf.type = 'application/x-shockwave-flash';
		swf.width = '0';
		swf.height = '0';
		$('body').append(swf);
	}
}

//------------------------------------------------------
function s_decorate(selector) {
	$(selector).each(function() {
		var $w = $(this);
		s_hook_forms($w);
	});
	
	$(window).trigger('load');
}

function s_init(c) {
	var m = { body: 'body' };
	$('meta').each(function() {
		var $t = $(this);
		var a = $t.attr('property');
		if (a && a.startsWith('s:')) {
			var v = $t.attr('content');
			m[a.substring(2)] = v;
		}
	});

	c = $.extend(m, c);
	c = s_setbase(c);

	// document - onload
	$(function() {
		s_onpageload();
		
		s_preload();
		
		s_totop();
		
		var $w = $(c.body);
		s_hook_forms($w);
		s_ie6_hack_forms($w);

		// google analytics
		s_google_analytics(c);
	});
}

// set default
s_setbase({
	base: '',
	cookie: { expires: 180 }
});

