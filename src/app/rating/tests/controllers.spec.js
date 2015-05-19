(function () {
    "use strict";

    describe("Tests for ratings controller: ", function () {
        var controller, scope, root, data, httpBackend, SERVER_URL;

        beforeEach(function () {
            module("mflAppConfig");
            module("mfl.rating");
            module("mfl.facilities.wrapper");

            inject(["$rootScope", "$controller", "$httpBackend", "SERVER_URL",
                "facilitiesApi",
                function ($rootScope, $controller, $httpBackend, url,
                    facilitiesApi) {
                    root = $rootScope;
                    scope = root.$new();
                    httpBackend = $httpBackend;
                    SERVER_URL = url;
                    facilitiesApi = facilitiesApi;
                    data = {
                        $scope :scope,
                        facilitiesApi : facilitiesApi,
                        SERVER_URL : url
                    };
                    controller = function (cntrl) {
                        return $controller(cntrl, data);
                    };
                }
            ]);
        });
        it("should test rating controller scope variable", function () {
            controller("mfl.rating.controllers.rating");
            var test = "Rating";
            expect(test).toEqual(scope.test);
        });
        it("should test if ratings are added to facilities services",
        inject(["$httpBackend", function ($httpBackend) {
                controller("mfl.rating.controllers.rating");
                var rating = 3;
                var id = "4d014de5-b500-439e-98b5-2fa1b5836b15";
                scope.fac_rating = {
                    facility_service : id,
                    rating : rating
                };
                var data = {
                    facility_services: [
                        {
                            name: "owaga"
                        },
                        {
                            name: "knh"
                        },
                        {
                            name: "hostel"
                        }
                    ]
                };
                $httpBackend.expectGET(SERVER_URL +
                    "api/facilities/facilities/1e0d5bc8-aa79-4c38-" +
                    "b938-714c28837c61/").respond(200, data);
                var rate = [
                    {
                        current : 0,
                        max: 5
                    }
                ];
                $httpBackend.flush();
                expect(
                    scope.oneFacility.facility_services[0].ratings).toEqual(rate);
                scope.getSelectedRating(rating, id);
                $httpBackend.expectPOST(
                    SERVER_URL +
                    "api/facilities/facility_service_ratings/").
                    respond(200, scope.fac_rating);
                $httpBackend.flush();

            }
        ]));
        it("should fail on call to rate a facility service",
        inject(["$httpBackend", function ($httpBackend) {
            controller("mfl.rating.controllers.rating");
            $httpBackend.expectGET(
                SERVER_URL +
                "api/facilities/facilities/1e0d5bc8-aa79-4c38-" +
                "b938-714c28837c61/").respond(400, {name : ""});
            var rating = 3;
            var id = "4d014de5-b500-439e-98b5-2fa1b5836b15";
            scope.getSelectedRating(rating, id);
            $httpBackend.expectPOST(
                    SERVER_URL +
                    "api/facilities/facility_service_ratings/").
                    respond(400, {name : ""});
            $httpBackend.flush();
        }]));
    });
})();
