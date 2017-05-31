(function(angular) {
	'use strict';

	var wistia = {
		url: 'https://upload.wistia.com',
		mediaUrl: 'https://api.wistia.com/v1/medias.json',
		password: '730423405433521be54cb5f05c599991464b926e9ad3ffe393be3832ae943344',
		namePrefix: 'wistia_'
	};

	function BlueImpUploadController($scope, $element, $attrs, $http, $timeout, $sce) {
		var ctrl = this,
			date = new Date();

		ctrl.progress = {
			width: 0 + '%'
		};
		ctrl.showIntroText = true;
		ctrl.showUploadLoader = false;
		ctrl.loaderText = "";
		ctrl.videoIsReady = false;

		$($element).fileupload({
			url: wistia.url,
			autoUpload: true,
			dataType: 'json',
			paramName: 'file',
			formData: [{
				name: 'api_password',
				value: wistia.password
			}, {
				name: 'name',
				value: wistia.namePrefix + date.getTime()

			}],
			done: function (e, data) {
				var hashedId = data.result.hashed_id,
					params = {
						api_password: wistia.password,
						hashed_id: hashedId
					};

				$http.get(wistia.mediaUrl, {params: params}).then(success, error);

				function success(response) {
					// check progress
					var progress = parseInt(response.data[0].progress * 100, 10),
						imageHtml = '<img src="' + response.data[0].thumbnail.url + '" style="width: 100%; height: 340px; background-color: #000">';

					// retry if not completed
					if (progress < 100) {

						$timeout(function() {
							ctrl.showUploadLoader = false;
							ctrl.videoIsReady = false;
							ctrl.videoName = response.data[0].name;
							ctrl.processingProgress = progress + '%';
							ctrl.videoPreviewHtml = $sce.trustAsHtml(imageHtml);
						}, 0);

						// retry until video processing completes
						$timeout(function(){
							$http.get(wistia.mediaUrl, {params: params}).then(success, error);
						}, 1000 * 5);

						return;
					}

					var iframeHtml = '<iframe src="https://fast.wistia.net/embed/iframe/' + hashedId + '" allowtransparency="true" frameborder="0" scrolling="no" class="wistia_embed" name="wistia_embed" style="width: 100%; height: 340px"></iframe>';

					$timeout(function() {
						ctrl.videoPreviewHtml = $sce.trustAsHtml(iframeHtml);
						ctrl.videoIsReady = true;
					}, 0);
				}

				function error(response) {
					$timeout(function() {
						ctrl.showUploadLoader = false;
						ctrl.videoPreviewHtml = $sce.trustAsHtml('<h4 class="loading">Oops! Something broke when making a request to Wistia. Sorry about that.</h4>');
					}, 0);
				}

			},
			progressall: function (e, data) {
				ctrl.showIntroText = false;
				ctrl.showUploadLoader = true;
				ctrl.loaderText = "Video is being uploaded. Please wait...";
				var progress = parseInt(data.loaded / data.total * 100, 10);

				$timeout(function() {
					ctrl.progress = {
						width : progress + '%'
					};
				}, 0);
			}
		});
	}

	angular.module('myApp').component('blueimpUpload', {
		templateUrl: 'components/blueimp/blueimp-upload.html',
		controller: BlueImpUploadController
	});
})(window.angular);