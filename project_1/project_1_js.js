angular.module('myApp', [])
    .controller('MainController', function($scope, $http) {
        $scope.submitForm = function() {
            var longInput = $scope.longitude;
            var latInput = $scope.latitude;
            var rawDate = new Date($scope.date); // Parse date string to Date object
            var date = formatDate(rawDate); // Format date in '%Y-%m-%d' format

            if (!longInput || !latInput || !date) {
                $scope.error = "Please fill in all fields.";
                return;
            }

            var lat = latInput.replace(/[^\d.]+/g, "");
            if (latInput.toUpperCase().includes("S")) {
                lat = "-" + lat;
            } else if (!latInput.toUpperCase().includes("N")) {
                $scope.error = "Invalid latitude format. Please include 'N' or 'S'.";
                return;
            }

            var long = longInput.replace(/[^\d.]+/g, "");
            if (longInput.toUpperCase().includes("W")) {
                long = "-" + long;
            } else if (!longInput.toUpperCase().includes("E")) {
                $scope.error = "Invalid longitude format. Please include 'E' or 'W'.";
                return;
            }

            var apiUrl = `https://api.nasa.gov/planetary/earth/assets?lon=${long}&lat=${lat}&date=${date}&dim=0.2&api_key=OKc7M2L32jO9EK1nGox6qJgWxp6FmaVZlbNXHju0`;

            $http.get(apiUrl)
                .then(function(response) {
                    $scope.error = '';
                    $scope.imageUrl = response.data.url;
                    // Call openImage function after successful image retrieval
                    if ($scope.imageUrl) {
                        $scope.openImage();
                    }
                })
                .catch(function(error) {
                    $scope.error = 'Error fetching image. Please try again later or with different coordinates and time.';
                    console.error('Error fetching image:', error);
                });
        };

        // Define openImage function outside of $http.get
        $scope.openImage = function() {
            var newWindow = window.open('', '_blank');
            newWindow.document.body.innerHTML = `
                <style>
                    body, html {
                        margin: 0;
                        height: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    img {
                        max-width: 100%;
                        max-height: 100%;
                    }
                </style>
                <img src="${$scope.imageUrl}" alt="Generated Image">
            `;
        };

        // Helper function to format date as '%Y-%m-%d'
        function formatDate(date) {
            var year = date.getFullYear();
            var month = ('0' + (date.getMonth() + 1)).slice(-2);
            var day = ('0' + date.getDate()).slice(-2);
            return `${year}-${month}-${day}`;
        }
    });
