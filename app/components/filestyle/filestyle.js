(function(angular) {
	'use strict';

	function FileStyleDirective() {
		return {
			restrict:'AC',
			scope: true,
			link: function ($scope, element, attrs) {
				var options = {
					'input': attrs.input === 'false' ? false : true,
					'icon': attrs.icon === 'false' ? false : true,
					'buttonBefore': attrs.buttonBefore === 'true' ? true : false,
					'disabled': attrs.disabled === 'true' ? true : false,
					'size': attrs.size,
					'buttonText': attrs.buttontext,
					'buttonName': attrs.buttonname,
					'iconName': attrs.iconname,
					'badge': attrs.badge === 'false' ? false : true,
					'placeholder': attrs.placeholder
				};
				$(element).filestyle(options);
			}
		};
	}

	angular.module('myApp').directive('filestyle', FileStyleDirective);
})(window.angular);