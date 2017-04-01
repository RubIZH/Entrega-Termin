(function ()
{
    'use strict';

    angular
        .module('app.calendar')
        .controller('CalendarController', CalendarController);

    /** @ngInject */
    function CalendarController($mdDialog,CalendarEvent,Contacts, $document)
    {
        var vm = this;

        // Data
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
    

        vm.events = 
        [
            [
                {
                    id   : 0,
                    title: "Dummy Event",
                    start: new Date(2999, m, 10),
                    end  : null
                } 
            ]
        ];
        
        
        
        
        for (i = 0; i < CalendarEvent.data.length; i++) { 
            vm.events[0].push({
                            id   : CalendarEvent.data[i].id,
                            title: CalendarEvent.data[i].title,
                            start: new Date(CalendarEvent.data[i].syear,CalendarEvent.data[i].smonth,CalendarEvent.data[i].sday),
                            end  : null,
                            starth:CalendarEvent.data[i].starth,
                            endh:CalendarEvent.data[i].endh
                        });
        }
      
      
        
        

        vm.calendarUiConfig = {
            calendar: {
                editable          : true,
                eventLimit        : true,
                header            : '',
                handleWindowResize: false,
                aspectRatio       : 1,
                dayNames          : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                dayNamesShort     : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                viewRender        : function (view)
                {
                    vm.calendarView = view;
                    vm.calendar = vm.calendarView.calendar;
                    vm.currentMonthShort = vm.calendar.getDate().format('MMM');
                },
                columnFormat      : {
                    month: 'ddd',
                    week : 'ddd D',
                    day  : 'ddd M'
                },
                eventClick        : eventDetail,
                selectable        : true,
                selectHelper      : true,
                select            : select
            }
        };

        // Methods
        vm.addEvent = addEvent;
        vm.next = next;
        vm.prev = prev;

        //////////

        /**
         * Go to next on current view (week, month etc.)
         */
        function next()
        {
            vm.calendarView.calendar.next();
        }

        /**
         * Go to previous on current view (week, month etc.)
         */
        function prev()
        {
            vm.calendarView.calendar.prev();
        }

        /**
         * Show event detail
         *
         * @param calendarEvent
         * @param e
         */
        function eventDetail(calendarEvent, e)
        {
            showEventDetailDialog(calendarEvent, e);
        }

        /**
         * Add new event in between selected dates
         *
         * @param start
         * @param end
         * @param e
         */
        function select(start, end, e)
        {
            showEventFormDialog('add', false, start, end, e);
        }

        /**
         * Add event
         *
         * @param e
         */
        function addEvent(e)
        {
            var start = new Date(),
                end = new Date();
            
    

            showEventFormDialog('add', false, start, end, e);
        }

        /**
         * Show event detail dialog
         * @param calendarEvent
         * @param e
         */
        function showEventDetailDialog(calendarEvent, e)
        {
            $mdDialog.show({
                controller         : 'EventDetailDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/apps/calendar/dialogs/event-detail/event-detail-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
                locals             : {
                    calendarEvent      : calendarEvent,
                    showEventFormDialog: showEventFormDialog,
                    event              : e
                }
            });
        }

        /**
         * Show event add/edit form dialog
         *
         * @param type
         * @param calendarEvent
         * @param start
         * @param end
         * @param e
         */
        function showEventFormDialog(type, calendarEvent, start, end,starth, endh, e)
        {
            var dialogData = {
                type         : type,
                calendarEvent: calendarEvent,
                start        : start,
                end          : end,
                starth       : starth,
                endh         : endh
            };

            $mdDialog.show({
                controller         : 'EventFormDialogController',
                controllerAs       : 'vm',
                templateUrl        : 'app/main/apps/calendar/dialogs/event-form/event-form-dialog.html',
                parent             : angular.element($document.body),
                targetEvent        : e,
                clickOutsideToClose: true,
                locals             : {
                    dialogData: dialogData
                }
            }).then(function (response)
            {
                switch ( response.type )
                {
                    case 'add':
                        // Add new
                        vm.events[0].push({
                            id   : vm.events[0].length + 20,
                            title: response.calendarEvent.title,
                            start: response.calendarEvent.start,
                            end  : response.calendarEvent.end,
                            starth: response.calendarEvent.starth,
                            endh:   response.calendarEvent.endh
                            
                        });
                        break;

                    case 'edit':
                        // Edit
                        for ( var i = 0; i < vm.events[0].length; i++ )
                        {
                            // Update
                            if ( vm.events[0][i].id === response.calendarEvent.id )
                            {
                                vm.events[0][i] = {
                                    title: response.calendarEvent.title,
                                    start: response.calendarEvent.start,
                                    end  : response.calendarEvent.end,
                                    starth: response.calendarEvent.starth,
                                    endh:   response.calendarEvent.endh
                                };

                                break;
                            }
                        }
                        break;

                    case 'remove':
                        // Remove
                        for ( var j = 0; j < vm.events[0].length; j++ )
                        {
                            // Update
                            if ( vm.events[0][j].id === response.calendarEvent.id )
                            {
                                vm.events[0].splice(j, 1);

                                break;
                            }
                        }
                        break;
                }
            });
        }
    }

})();