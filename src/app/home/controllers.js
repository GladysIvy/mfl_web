"use strict";
angular.module("mfl.home.controllers", ["mfl.facilities.wrapper"])

    .controller("mfl.home.controllers.home", ["$scope",
        "facilitiesApi",function ($scope, facilitiesApi) {
        $scope.test="home";
        $scope.pubed_fac = [];
        $scope.latest_fac = {
            page_size : 10
        };
        facilitiesApi.api.filter($scope.latest_fac)
            .success(function (facilities) {
                $scope.new_facilities = _.where(facilities.results, {"is_published" : true});
                for(var i=0; i < 4; ++i) {
                    $scope.pubed_fac.push($scope.new_facilities[i]);
                }
            })
            .error(function (e) {
                console.log(e);
            });
    }])

    .controller("mfl.home.controllers.header", ["$scope",
        "$state",
        function ($scope, $state) {
            $scope.test = "Search";
            $scope.search = function (query) {
                $state.go("home.search_results", {result: query});
            };
        }
    ])

    .controller("mfl.home.controllers.search_results", ["$scope",
        "facilitiesApi", "$state",
        function ($scope, facilitiesApi, $state) {
            $scope.test = "search results";
            $scope.search = {
                search : $state.params.result
            };
            $scope.query = $state.params.result;
            //doing the search query
            facilitiesApi.api.filter($scope.search)
                .success(function (query_rslt) {
                    $scope.query_results = query_rslt.results;
                    console.log($scope.query_results);
                })
                .error(function (e) {
                    console.log(e.error);
                });
        }
    ]);
