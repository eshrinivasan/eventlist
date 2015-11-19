'use strict';

angular.module('app', [])

    .constant('shortDays', ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
    .constant('shortMonths', ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'])
    .factory('datetostr', ['shortDays', 'shortMonths', function(shortDays, shortMonths) {
        return function(dateobj) {
            return shortDays[dateobj.getDay()] + ', ' + shortMonths[dateobj.getMonth()] + ' ' + dateobj.getDate() + ', ' + dateobj.getFullYear();
        }
    }])

    .controller('ApplicationCtrl', ['$scope', '$http',
        function ($scope, $http) {
            $scope.events = [];
            $scope.event = {};
            /* not used
            $scope.formatDate = function(dateobj) {
                var shortDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                var shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                return shortDays[dateobj.getDay()] + ', ' + shortMonths[dateobj.getMonth()] + ' ' + dateobj.getDate() + ', ' + dateobj.getFullYear();
            };
            */

            // Use http service to make an API call to return all upcoming events from the Mongo db
            // Populate local scope var events with returned data
            $scope.getEvents = function () {
                $http.get('/api/events')
                    .success(function (data, status, headers, config) {
                        $scope.instruc = 'Data read successfully: ' + data.length + ' records';
                        $scope.events = data;
                    })
                    .error(function (data, status, headers, config) {
                        $scope.instruc = data;
                    });
            };

            // Use http service to make an API call to save the passed event in the Mongo db
            // Update local scope var events and clear local scope var event for next input
            $scope.saveEvent = function () {

                // convert date field in editing form to actual date object
                $scope.event.eventdate = new Date($scope.datestr);

                $http.post('/api/events', {event:$scope.event})
                    .success(function (data, status, headers, config) {
                        // update local vars events and event
                        $scope.event._id = data._id;
                        $scope.events.push($scope.event);
                        $scope.event = {};
                    })
                    .error(function (data, status, headers, config) {
                        $scope.instruc = data.msg;
                    });
            };

            // Use http service to make an API call to delete the event for the passed id from the Mongo db
            // Update local scope var events
            $scope.deleteEvent = function(event) {
                $http.post('/api/events/delete/', {id:event._id})
                    .success(function (data, status, headers, config) {
                        // update local scope events
                        for (var i=0; i<$scope.events.length; i++) {
                            if ($scope.events[i]._id == event._id) {
                                $scope.events.splice(i, 1);
                                break;
                            }
                        }
                    })
                    .error(function (data, status, headers, config) {
                        $scope.instruc = data.msg;
                    });
            };

            // Call getEvents on startup to populate the admin page with an events list
            $scope.getEvents();
        }]);