from pyramid.view import view_config
from myworldapp.core.server.controllers.base.myw_controller import MywController
import myworldapp.core.server.controllers.base.myw_globals as myw_globals
from datetime import datetime
import jwt
import json
import traceback


#
# Error codes
#
ERROR_UNEXPECTED="InternalServerError"
CREATED="SuccessfullyCreated"
ERROR_INVALID_TOKEN="TokenValidationError"

response_codes = {
    ERROR_UNEXPECTED: 500,
    ERROR_INVALID_TOKEN: 403,
    CREATED: 201
}

class TroubleTicketController(MywController):
    
    def _handle_error_response(self, response, type, message):
        ## 
        ## Create Error response structure
        ## 
        code = response_codes.get(type)
        error = {
            "code": str(code),
            "property": type,
            "message": message
        }
        response.status_code = code
        return error

    def _handle_error(self, response, type, exc):
        ## Create Error response structure for exception
        message = str(exc)
        traceback_str = ''.join(traceback.format_tb(exc.__traceback__))
        print("ERROR: Unexpected error : {}".format(message))
        print(traceback_str)
        return self._handle_error_response(response, type, message)

    def _insert(self, json_data):
        ##
        ## Insert Capture Package records to database
        ##
        table = self.db.view().table("trouble_ticket")
        detached_rec = table._new_detached()
        for key, value  in json_data.items():
            if key == "id":
                continue
            detached_rec[key] = value
        new_rec = table.insert(detached_rec)
        return new_rec

    @view_config(route_name="trouble_ticket_controller.ticket", request_method='POST', renderer='json')
    def ticket(self):
        ##
        ## POST request handler
        ##
        self.db = myw_globals.db
        request = self.request
        response = request.response
        try:
            json_data = json.loads(request.body)
            new_ticket = self._insert(json_data)
            json_data["id"] = new_ticket.id
            self.db.commit()
            response.status_code = response_codes.get(CREATED)
            print(json_data)
            return json_data
        except Exception as exc:
            return self._handle_error(response, ERROR_UNEXPECTED, exc)      