import collections
from functools import update_wrapper
from flask import request, jsonify
from flask_inputs import Inputs
from flask_inputs.validators import JsonSchema

from werkzeug.exceptions import BadRequest
from future.utils import iteritems
from wtforms.form import BaseForm
from wtforms.fields import Field


class ValidatedInputs(Inputs):
    def __init__(self, schema: dict, request):
        self.json = [JsonSchema(schema=schema)]
        self.errors = []

        self._request = request
        self._forms = dict()

        for name in dir(self):
            if not name.startswith("_") and name not in [
                "errors",
                "validate",
                "valid_attrs",
            ]:
                input = getattr(self, name)
                fields = dict()

                if isinstance(input, dict):
                    for field, validators in iteritems(input):
                        fields[field] = Field(validators=validators)
                elif isinstance(input, collections.abc.Iterable):
                    fields["_input"] = Field(validators=input)

                self._forms[name] = BaseForm(fields)


def validate_required(schema):
    def decorator(fn):
        def wrapped(*args, **kwargs):
            print(schema)
            inputs = ValidatedInputs(schema, request)
            if not inputs.validate():
                raise BadRequest(response=jsonify({"errors": inputs.errors}))
            return fn(*args, **kwargs)

        return update_wrapper(wrapped, fn)

    return decorator
