"use strict";
angular.module("mfl.home.controllers", ["mfl.facilities.wrapper"])

    .controller("mfl.home.controllers.home", ["$scope", "$state",
        function ($scope, $state) {
        $scope.test="home";
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        $scope.search = function (query) {
            $state.go("search_results", {result: query});
        };
    }])

    .controller("mfl.home.controllers.header", ["$scope",
        function ($scope) {
            $scope.test = "Search";
        }
    ])

    .controller("mfl.home.controllers.search_results", ["$scope",
        "facilitiesApi", "$state",
        function ($scope, facilitiesApi, $state) {
            $scope.test = "search results";
            $scope.search = {
                search : $state.params.result
            };
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            $scope.search_results = true;
            $scope.no_result = false;
            $scope.query = $state.params.result;
            $scope.err = "";
            //doing the search query
            facilitiesApi.facilities.api.filter($scope.search)
                .success(function (query_rslt) {
                    $scope.search_results = false;
                    $scope.query_results = query_rslt.results;
                    console.log($scope.query_results);
                    if($scope.query_results.length === 0) {
                        $scope.no_result = true;
                    }
                })
                .error(function (e) {
                    console.log(e.error);
                    $scope.err = e.error;
                    $scope.search_results = false;
                });
        }
    ])

    .controller("mfl.home.controllers.facility_details", ["$scope",
        "facilitiesApi", "$state",
        function ($scope, facilitiesApi, $state) {
            $scope.test = "facility";
            $scope.tooltip = {
                "title": "",
                "checked": false
            };
            facilitiesApi.facilities.api.get($state.params.fac_id)
                .success(function (one_fac) {
                    $scope.oneFacility = one_fac;
                })
                .error(function (e) {
                    console.log(e);
                });
        }
    ]);
