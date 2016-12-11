declare function require(arg: string): any;

var validator = require('xmllint-jsparser');

export class XMLValidator {
    private schemaObject: any;

    constructor(private schema:string) {

    }

    validate(xml: string): Error[] {
        var result = validator.validateXML({xml: xml, schema: this.schema});

        return (result && result.errors && result.errors.map((error: any) => new Error(error))) || [];
    }
}