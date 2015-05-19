"use strict";

angular.module("mfl.facilities.wrapper", ["sil.api.wrapper", "mflAppConfig"])

    .service("facilitiesApi", ["api", function (api) {
        this.facilities = api.setBaseUrl("api/facilities/facilities");
        this.services = api.setBaseUrl("api/facilities/services");
    }])
    .service("searchService",["SERVER_URL", "sil-typeahead",
        function (SERVER_URL, typeahead) {
            var facilities_url = "api/facilities/facilities/?search=%QUERY";
            var initFacilities = function () {
                return typeahead.initTT(
                    "facilities",
                    "name",
                    SERVER_URL+facilities_url,
                    15
                );
            };
            this.typeaheadFacilities = function (fieldclass) {
                var f = initFacilities();
                var name = fieldclass || "facilities";
                typeahead.typeaheadUI(name, {
                    displayKey: "name",
                    source: f.ttAdapter()
                });
            };
        }]);
