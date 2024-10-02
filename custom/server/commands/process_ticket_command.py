###############################################################################
# Command line util 
###############################################################################
import argparse

from myworldapp.core.server.commands.myw_db_command import MywDbCommand, _define_operation, _add_standard_args
from myworldapp.core.server.commands.myw_command import MywCommand
from myworldapp.core.server.commands.myw_argparse_help_formatter import MywArgparseHelpFormatter


class ProcessTicketCommand(MywDbCommand):
    arg_parser = argparse.ArgumentParser(prog="myw_db", formatter_class=MywArgparseHelpFormatter)
    arg_parser.add_argument(
        "--version", action="version", version="%(prog)s " + MywCommand.version()
    )
    arg_parser.epilog = "Process tickets."

    arg_parser.add_argument("db_name", type=str, help="Name of PostgreSQL database")
    arg_subparsers = arg_parser.add_subparsers(
        dest="operation", help="Operation to perform", required=True
    )

    op_def = _define_operation(arg_subparsers, "process", help="process ticket")
    _add_standard_args(op_def)
    def operation_process(self):
        self.db = self.db_server.open(self.args.db_name)
        self.db_view = self.db.view()
        self.session = self.db.session
        ticket_model = self.db_view.table("trouble_ticket").model

        ticket_to_process = (self.session.query(ticket_model).
            filter(ticket_model.status == 'completed').
            all()
        )
        
        for rec in ticket_to_process:
            print(rec.id)
        