

import OpModules from "../core/config/modules/OpModules.mjs";
import Categories from "../core/config/Categories.json" assert {type: "json"};
import OperationConfig from "../core/config/OperationConfig.json" assert {type: "json"};

function getOperation(module_name, op_name, args) {
    let module = OpModules[module_name]

    if (!module) {
        return null
    }

    let op = module[op_name];

    if (!op) {
        return null
    }

    if (args) {
        op.args = args
    }

    return op
}

class Executor {

    constructor() {
        this.opList = []
        if (arguments.length > 0) {
            let module_name = "Default"
            let op_name
            let args

            if (arguments.length == 1) {
                op_name = arguments[0]
            } else if (arguments.length == 2) {
                op_name = arguments[0]
                args = arguments[1]
            } else {
                module_name = arguments[0]
                op_name = arguments[1]
                args = arguments[2]
            }

            let op = getOperation(module_name, op_name, args)

            if (!op) {
                throw "Operation not exist"
            }

            this.opList = [op];
        }

    }




    addOperation() {
        if (arguments.length == 0) {
            throw "Arguments error"
        }

        let module_name = "Default"
        let op_name
        let args

        if (arguments.length == 1) {
            op_name = arguments[0]
        } else if (arguments.length == 2) {
            op_name = arguments[0]
            args = arguments[1]
        } else {
            module_name = arguments[0]
            op_name = arguments[1]
            args = arguments[2]
        }

        let op = getOperation(module_name, op_name, args)

        if (!op) {
            throw "Operation not exist"
        }

        this.opList.push(op);
    }


    run(input, args) {
        if (this.opList.length >= 2) {
            return runMulti(input)
        }

        if (this.opList.length == 0) {
            throw "Operation not exist"
        }

        let op = new this.opList[0]()

        let output = op.run(input, args)

        return {
            output: output,
            outputType: op.outputType
        }

    }

    runMulti(input) {

    }

    static getOpCategories() {
        return Categories
    }

    static getOpConfigs() {
        return OperationConfig
    }

    static getOpConfig(op_name) {
        return OperationConfig[op_name]
    }
}

export default {
    Executor: Executor
}