$(document).ready(function() {
	var $window = $(window),
		body = $('body'),
		inputSearch = $('.search-input'),
		sortpanel = $('#sort-panel'),
		dropBtn = $('.dropable'),
		isSelectPage = false;
	if ($('#aside-filter').length) {
		isSelectPage = true;
	}
	// ===============================
	//  Function for Toggle Open Class
	// ===============================
	$.fn.toggleOpen = function(openObject, opened) {
		var creatOpenToggler = function() {
			$(this).on('click', function() {
				openObject.toggleClass(opened);
				return false;
			});
		};
		return this.each(creatOpenToggler);
	};
	if (window.matchMedia("(min-width: 768px)").matches) {
		// ==============================
		//  Uncomment mobile hidden blocks
		// ==============================
		$('.mobile-hidden')
			.contents()
			.filter(function() { return this.nodeType === 8; }) //get the comments
			.replaceWith(function() { return this.data; })
		// ==============================
		//  Yandex map
		// ==============================
		// ymaps.ready(init);
		// var myMap,
		// 	myPlacemark;

		// function init() {
		// 	myMap = new ymaps.Map("map", {
		// 		center: [55.51262, 37.575459],
		// 		zoom: 14
		// 	});

		// 	myPlacemark = new ymaps.Placemark([55.51262, 37.575459], {}, { preset: 'islands#redDotIcon' });
		// 	myMap.geoObjects.add(myPlacemark);
		// }
	} else {
		// ==============================
		//  Responsive Menu
		// ==============================	
		var respMenu = $('.resp-btn'),
			aside = $('.aside');
		respMenu.toggleOpen(body, 'menu-opened');
		// ==============================
		//  Top and Filter Buttons
		// ==============================	

		var toTop = $('#toTop'),
			appearanceBtns = toTop,
			contentTop = 500;
		if (isSelectPage) {
			var btnFilter = $('#btnFilter'),
				openFilter = $('.resp-filter')
			contentTop = sortpanel.offset().top,
				appearanceBtns = toTop.add(btnFilter);
			// ==============================
			//  Open Filter
			// ==============================	
			openFilter.add(btnFilter).toggleOpen(aside, 'filter-opened');
		}
		$window.on('scroll', function() {
			if ($(this).scrollTop() > contentTop) {
				appearanceBtns.fadeIn();
			} else {
				appearanceBtns.fadeOut();
			}
		});
		toTop.click(function() {
			$('html, body').animate({ scrollTop: 0 }, 500);
		});

	}
	// ==============================
	//  Aside filter accordions
	// ==============================
	if (isSelectPage) {
		$filterTitle = $('.filter-title');
		$filterTitle.on('click', function() {
			$(this).parent().toggleClass('accordion-opened');
		});
	}
	// ==============================
	//  Top menu Drop down
	// ==============================
	dropBtn.on('click', function() {
		$this = $(this);
		dropOpened = $this.parent();
		if (dropOpened.hasClass('drop-opened')) {
			dropOpened.removeClass('drop-opened');
			body.off('click');
		} else {
			$('.drop-opened').removeClass('drop-opened');
			dropOpened.toggleClass('drop-opened');
			if ($this.hasClass('btn-search')) {
				inputSearch.focus();
			};
			body.one('click', function(e) {
				dropOpened.removeClass('drop-opened');
			});
			dropOpened.on('click', function(e) {
				e.stopPropagation();
			});
		}

	});
	// ==============================
	//  Switcher filter tabs
	// ==============================
	function switcherTabs(controlsSet) {
		var tabsSet = $(controlsSet),
			tabs = tabsSet.children(),
			panels = tabsSet.siblings();
		tabs.on('click', function(event) {
			event.preventDefault();
			selectedTab = $(this).attr('href');
			tabs.removeClass('control-selected');
			panels.hide().removeClass('tab-selected');
			$(this).addClass('control-selected');
			$(selectedTab).addClass('tab-selected').show();
		})
	}
	switcherTabs('.filter-control');

	// ==============================
	//  Controls in top block of Category
	// ==============================
	topControl = $('.top-control');
	if (topControl.length) {
		topControl.siblings().find('span').on('click', function() {
			var $this = $(this),
				thisText = $this.text(),
				thisParent = $this.parent(),
				parentNext = thisParent.next(),
				parentNextId = thisParent.attr('id'),
				nameValue = 'input[name=' + parentNextId + ']';
			$('#sizes').find(nameValue).attr('name', parentNextId).val(thisText).attr('value', thisText);
			topControl.children('.active').removeClass('active').next().addClass('active')
			if (parentNext.length) {
				parentNext.siblings().addClass('hidden');
				parentNext.removeClass('hidden');
			} else {
				$('#aside-filter').submit();
			}
		});
	}
	// ==============================
	//  Clicking filter forms
	// ==============================
	var filterForm = $('.filter-form'),
		filterInput = filterForm.find('.filter-input'),
		filterWrap = filterInput.parent();
	filterInput.on('focus', (function() {
		var $this = $(this),
			thisWrap = $this.parent(),
			filterForm = $this.closest('.filter-form'),
			filterItem = $this.next().find('li')
		searchable = false;
		nextdisabled = false;
		if ($this.hasClass('searchable')) {
			var searchable = true;
		}
		filterInput.val(function() {
			return this.defaultValue;
		});
		filterWrap.removeClass('input-focused');
		thisWrap.addClass('input-focused');
		if (searchable) {
			$this.on("keyup", function() {
				var value = $(this).val().toLowerCase();
				filterItem.filter(function() {
					$(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
				});
			});
		}
		filterItem.off().on('click', function() {
			var filterValue = "";
			filterValue = $(this).text();
			$this.attr('value', filterValue).val(filterValue);
			thisWrap.removeClass('input-focused');
			if (!searchable) {
				filterItem.toggleClass('hidden');
			} else {
				wrapNext = thisWrap.next();
				wrapNextChildren = wrapNext.children();
				if (wrapNext.length && wrapNextChildren.prop('disabled')) {
					wrapNextChildren.prop('disabled', false);
				}
			}
		});
		body.off().on('click', function() {
			thisWrap.removeClass('input-focused');
			filterItem.removeAttr('style');
			filterInput.val(function() {
				return this.defaultValue;
			});
			body.off('click');
		})
		$this.add(filterItem).on('click', function(e) {
			e.stopPropagation();
		});
	}));
	$('.filter-add').on('click', function() {
		$(this).parent().addClass('back-opened');
	});

	$filterDuo = $('#filter-duo');
	if ($filterDuo.length) {
		$('.filter-reset').on('click', function() {
			if ($filterDuo.attr('value') == 'discs') {
				$filterDuo.next().find('li').toggleClass('hidden');
			}
			filterInput.removeAttr('value');
			$filterDuo.attr('value', 'Шины');
		})
	}
	filterForm.submit(function() {
		$(this).find('input').not('[value]').prop('disabled', true);
		return true;
	});
	// ==============================
	//  Runflat checkboxes
	// ==============================
	$('.checks-runflat').on('change', function() {
		var checked = $(this).is(':checked');
		$(".checks-runflat").prop('checked', false);
		if (checked) {
			$(this).prop('checked', true);
		}
	})
	// ==============================
	//  Order form manipulations
	// ==============================
	var spanQty = $('.order-quantity').children('span');
	spanQty.on('click', function() {
		var $this = $(this),
			fieldQty = $this.siblings('input'),
			valQty = +fieldQty.prop('value'),
			parentQty = $this.parent(),
			resultQty = parentQty.next(),
			priceOne = +parentQty.prev().text().replace(",", "."),
			newValue = "";
		console.log(priceOne * 2);
		if ($this.hasClass('order-minus')) newValue = (Math.max((valQty - 1), 1));
		else newValue = valQty + 1;
		var resultTotal = (priceOne * newValue).toFixed(3) + "";
		fieldQty.prop('value', newValue).val(newValue);
		resultQty.text(newValue + ': ' + "" + resultTotal.replace(".", ","));
	});
	// ===============================
	//  Sorting
	// ===============================
	var sortList = $('.sorting-list'),
		sortWrap = sortList.parent(),
		sortTab = sortList.children(),
		sortItems = sortpanel.children(),
		sortField = sortList.prev(),
		sortInput = $('#sort-input');
	sortField.toggleOpen(sortWrap, 'sort-opened');
	sortTab.on('click', function() {
		$this = $(this);
		var sortId = $this.prop('id'),
			divider = (sortId).indexOf('-');
		if (divider > -1) {
			var sortdata = sortId.substr(0, divider);

			function sortmaker(a, b) {
				return ($(b).data(sortdata)) < ($(a).data(sortdata)) ? 1 : -1;
			}
		} else {
			var sortdata = sortId;

			function sortmaker(a, b) {
				return ($(b).data(sortdata)) > ($(a).data(sortdata)) ? 1 : -1;
			}
		}
		sortItems.sort(sortmaker).appendTo(sortpanel);
		sortField.text($this.text());
		sortWrap.removeClass('sort-opened');
		sortInput.val(sortId);

	})
});