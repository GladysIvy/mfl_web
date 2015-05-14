"use strict";
(function(angular){
    angular.module("mfl.filtering.controllers", [
        "mfl.filtering.services",
        "mfl.search.utils"
    ])
    .controller("mfl.filtering.controller", ["$scope","$rootScope","$stateParams", "filteringApi",
        "mfl.search.filters.changes","filteringData", function($scope, $rootScope,
        $stateParams,filterApi, changedFilters, filteringData){
        $scope.filter_data = {};
        _.each(["county", "operation_status", "constituency", "facility_type"], function(key){
            $scope.filter_data[key] = filteringData[key].data.results;
            $rootScope.mfl_filter_data = $scope.filter_data;
        });
        if(_.isUndefined($stateParams.search)){
            filterApi.facilities.list().success(function(res){
                $scope.query_results = res.results;
            }).error(function(err){
                $scope.alert = err.error;
            });
        }else{
            filterApi.facilities.filter({search: $stateParams.search}).success(function(res){
                $scope.query_results = res.results;
            }).error(function(err){
                $scope.alert = err.error;
            });
        }
        $scope.filter = {
            county: [],
            constituency: [],
            ward: [],
            operation_status: [],
            facility_type: [],
            number_of_beds: [],
            number_of_cots: []
        };
        $scope.numbers = _.range(2000);
        $scope.disabled = {
            ward: true,
            consts: true
        };
        // var setFilters = function(){
        //     _.each(_.keys($stateParams), function(key){
        //         if(!_.isUndefined($stateParams[key])){
        //             if(_.contains(_.keys($scope.filter), key)){
        //                 var res = _.findWhere($scope.filter[key], {id:$stateParams[key]});
        //                 if(_.isEmpty(res)){
        //                     console.log(res);
        //                     // $scope.filter[key].push({id:$stateParams[key], name: "name"});
        //                 }

        //             }else{
        //                 $scope.filter[key] = $stateParams[key];
        //             }
        //         }

        //     });
        // };

        var getChildren = function(api, key, filter){
            api.filter(
                _.extend(filter, $scope.default_filter))
                .success(function(data){
                    $scope.filter_data[key] = [];
                    $scope.filter_data[key] = data.results;
                    $scope.disabled[key] = false;
                }).error(function(err){
                    $scope.alert =err.error;
                    $scope.filter_data[key] = [];
                    $scope.disabled[key] = true;
                });
        };
        $scope.$watch("filter.county", function(county){
            if(!_.isUndefined(county)){
                $scope.filter_data.constituency = [];
                getChildren(
                        filterApi.constituencies,
                        "constituency",
                        constructParams({county: county})
                );
            }
        });

        $scope.$watch("filter.constituency", function(constituency){
            $scope.filter_data.ward = [];
            if(!_.isEmpty(constituency)){
                getChildren(filterApi.wards, "ward",
                constructParams({constituency: constituency}));
            }
        });

        var constructParams = function(changes){
            _.each(_.keys(changes), function(key){
                if(_.isArray(changes[key])){
                    changes[key] = _.reduce(changes[key],
                        function(memo, item){
                            if(_.has(item, "id")){
                                return memo+item.id+",";
                            }else{
                                return memo+item+",";
                            }
                        }, "");
                }
                if(_.has(changes[key], "id")){
                    changes[key] = changes[key].id;
                }
                if(_.isEmpty(changes[key])){
                    if(!_.contains([true, false], changes[key])){
                        delete changes[key];
                    }
                }
                try{
                    if(changes[key][changes[key].length-1]===","){
                        changes[key] = changes[key].substring(0, changes[key].length-1);
                    }
                }catch(error){}

            });
            return changes;
        };

        $scope.filterFacility = function(frm){
            var changes= changedFilters.whatChanged(frm);
            if(!_.isEmpty(changes)){
                changes = constructParams(changes);
                if(_.has(changes, "ward")){
                    delete changes.county;
                    delete changes.constituency;
                }else{
                    if(_.has(changes, "constituency")){
                        delete changes.county;
                    }
                }
                filterApi.facilities.filter(changes).success(function(data){
                    $scope.query_results = data.results;
                }).error(function(error){
                    $scope.alert = error.error;
                });
            }
        };
    }]);
})(angular);
