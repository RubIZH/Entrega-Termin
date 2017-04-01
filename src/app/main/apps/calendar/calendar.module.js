(function ()
{
    'use strict';

    angular
        .module('app.calendar',
            [
                // 3rd Party Dependencies
                'ui.calendar'
            ]
        )
        .config(config)
        .service("calID", function obtainID(){
        
        var calID = this;
        calID.message = " ";
        
    });

    /** @ngInject */
    function config($stateProvider, $translatePartialLoaderProvider, msApiProvider, msNavigationServiceProvider)
    {
        // State
        $stateProvider.state('app.calendar', {
            url      : '/calendar',
            views    : {
                'content@app': {
                    templateUrl: 'app/main/apps/calendar/calendar.html',
                    controller : 'CalendarController as vm'
                }
            },  
            
            resolve: {
                CalendarEvent: function (msApi)
                {
                    return msApi.resolve('calendar.calendarEvent@get');
                }, 
                Contacts: function (msApi)
                {
                    return msApi.resolve('calendar.contacts@get');
                }
                
            }
            
            
            
        });

        // Translation
        $translatePartialLoaderProvider.addPart('app/main/apps/calendar');
        
         // Api
        msApiProvider.register('calendar.calendarEvent', ['app/data/calendar/calendar.json']);
        msApiProvider.register('calendar.contacts', ['app/data/contacts/contacts.json']);

        // Navigation
        msNavigationServiceProvider.saveItem('apps.calendar', {
            title : 'Calendar',
            icon  : 'icon-calendar-today',
            state : 'app.calendar',
            weight: 2
        });
    }
    
    
    
    
    
})();