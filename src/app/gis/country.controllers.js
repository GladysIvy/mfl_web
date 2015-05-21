(function(angular){
    "use strict";
    angular
    .module("mfl.gis_country.controllers", ["leaflet-directive",
        "mfl.gis.wrapper"])
    .controller("mfl.gis.controllers.gis", ["$scope","leafletData",
        "$http","$stateParams","$state","SERVER_URL","gisCountiesApi","gisFacilitiesApi",
        "$timeout","gisCountryBound",
        function ($scope,leafletData,$http, $stateParams,
                   $state,SERVER_URL, gisCountiesApi, gisFacilitiesApi,$timeout, gisCountryBound) {
        $scope.tooltip = {
            "title": "",
            "checked": false
        };
        $scope.title = [
            {
                icon: "fa-map-marker",
                name: "Geographic Discovery"
            }
        ];
        $scope.action = [
            {
                func : "onclick=window.history.back()",
                class: "action-btn action-btn-primary action-btn-md",
                color: "blue",
                tipmsg: "Go back",
                icon: "fa-arrow-left"
            }
        ];
        $scope.defaults = {
            scrollWheelZoom: false,
            tileLayer: ""
        };
        $scope.events = {
            map: {
                enable: ["moveend", "popupopen"],
                logic: "emit"
            },
            marker: {
                enable: [],
                logic: "emit"
            }
        };
        $scope.markers = {};
        $scope.layers = {};
        leafletData.getMap().then(function (map) {
                var coords = gisCountryBound.data.results.features[0]
                .properties.bound.coordinates[0];
                var bounds = _.map(coords, function(c) {
                    return [c[1], c[0]];
                });
                map.fitBounds(bounds);
            });

        // Handle mouseover and click events on the rendered map
        $scope.$on("leafletDirectiveMap.geojsonMouseover", function(ev, county) {
            $scope.hoveredCounty = county;
        });
        $scope.$on("leafletDirectiveMap.geojsonClick", function(ev, county) {
            var boundary_ids = county.properties.constituency_boundary_ids.join(",");
            $stateParams.const_boundaries = boundary_ids;
            $state.go("gis_county",{county_id: county.id,
                                    const_boundaries : boundary_ids});
        });
        gisCountiesApi.api
        .list()
        .success(function (data){
            var marks = data.results.features;
            var markers = _.mapObject(marks, function(mark){
                return  {
                        layer: "counties",
                        lat: mark.properties.center.coordinates[1],
                        lng: mark.properties.center.coordinates[0],
                        label: {
                            message: ""+mark.properties.name+"",
                            options: {
                                noHide: true
                            }
                        }
                    };
            });
            $scope.markers = markers;
            angular.extend($scope, {
                layers:{
                    baselayers:{
                        counties:{
                            name:"Counties",
                            type:"group",
                            visible: true,
                            data: []
                        }
                    },
                    overlays:{
                        heat: {
                            name: "Facilities",
                            type: "heat",
                            data: angular.copy($scope.heatpoints),
                            layerOptions: {
                                radius: 25,
                                opacity:1,
                                blur: 1,
                                gradient: {0.2: "lime", 0.3: "orange",0.4: "red"}
                            },
                            visible: true
                        }
                    }
                }
            });
            angular.extend($scope,{
                geojson: {
                    data: data.results,
                    style: {
                        fillColor: "rgba(255, 255, 255, 0.01)",
                        weight: 2,
                        opacity: 1,
                        color: "rgba(0, 0, 0, 0.52)",
                        dashArray: "3",
                        fillOpacity: 0.7
                    }
                },
                selectedConst: {}
            });
        })
        .error(function(err){
            $scope.alert = err.error;
        });
        gisFacilitiesApi.api
        .list()
        .success(function (data){
            var heats = data.results.features;
            var heatpoints = _.map(heats, function(heat){
                return [
                        heat.geometry.coordinates[1],
                        heat.geometry.coordinates[0]
                    ];
            });
            $scope.heatpoints = heatpoints;
        })
        .error(function(err){
            $scope.alert = err.error;
        });
    }]);
})(angular);
