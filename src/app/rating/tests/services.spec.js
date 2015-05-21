(function () {
    "use strict";
    describe("Test ratings service: ", function () {
        var localStorage, backend;
        beforeEach(function () {
            module("mflAppConfig");
            module("mfl.rating");
            module("mfl.rating.services");
            localStorage = {
                getItem : null
            };
            /*module("$provide", function (p) {
                p.value("$window", {
                    "localStorage" : localStorage
                });
            });*/
        });
        beforeEach(inject(["$window","mfl.rating.services.rating",
            function($window, ls) {
                backend = ls;
                $window = $window;
            }
        ]));
        it("should get a rating",
        inject(["$window",function ($window) {
            //spyOn(backend, "getRating").andReturn(1);
            var service_id = "123";
            backend.getRating(service_id);
            var key_value = $window.localStorage.getItem(service_id);
            expect(key_value).toBe(null);
        }]));
    });
})();
