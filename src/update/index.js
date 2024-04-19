

import CiphersModule from "../core/config/modules/Ciphers.mjs";
import DefaultModule from "../core/config/modules/Default.mjs";
import EncodingsModule from "../core/config/modules/Encodings.mjs";
import CryptoModule from "../core/config/modules/Crypto.mjs";
import SerialiseModule from "../core/config/modules/Serialise.mjs";
import HashingModule from "../core/config/modules/Hashing.mjs";
import BletchleyModule from "../core/config/modules/Bletchley.mjs";
import CodeModule from "../core/config/modules/Code.mjs";
import DiffModule from "../core/config/modules/Diff.mjs";
import ShellcodeModule from "../core/config/modules/Shellcode.mjs";
import ChartsModule from "../core/config/modules/Charts.mjs";
import RegexModule from "../core/config/modules/Regex.mjs";
import ImageModule from "../core/config/modules/Image.mjs";
import PGPModule from "../core/config/modules/PGP.mjs";
import CompressionModule from "../core/config/modules/Compression.mjs";
import PublicKeyModule from "../core/config/modules/PublicKey.mjs";
import OCRModule from "../core/config/modules/OCR.mjs";
import URLModule from "../core/config/modules/URL.mjs";
import UserAgentModule from "../core/config/modules/UserAgent.mjs";
import ProtobufModule from "../core/config/modules/Protobuf.mjs";

import Categories from "../core/config/Categories.json" assert {type: "json"};
import OperationConfig from "../core/config/OperationConfig.json" assert {type: "json"};

const OpModules = {};

Object.assign(
    OpModules,
    CiphersModule,
    DefaultModule,
    EncodingsModule,
    CryptoModule,
    SerialiseModule,
    HashingModule,
    BletchleyModule,
    CodeModule,
    DiffModule,
    ShellcodeModule,
    ChartsModule,
    RegexModule,
    ImageModule,
    PGPModule,
    CompressionModule,
    PublicKeyModule,
    OCRModule,
    URLModule,
    UserAgentModule,
    ProtobufModule,
);

function getOperation(moduleName, opName) {
    let module = OpModules[moduleName]

    if (!module) {
        return null
    }

    let op = module[opName];

    if (!op) {
        return null
    }
    return op
}

class Executor {

    constructor() {
        if (arguments.length == 0) {
            throw "Arguments error"
        }

        let moduleName = "Default"
        let opName


        if (arguments.length == 1) {
            opName = arguments[0]
        } else if (arguments.length >= 2) {
            moduleName = arguments[0]
            opName = arguments[1]
        }


        let op = getOperation(moduleName, opName)

        if (!op) {
            throw "Operation not exist"
        }

        this.op = new op();
    }


    run(input, args) {
        if (!this.op) {
            throw "Operation not exist"
        }


        let output = this.op.run(input, args)

        return {
            output: output,
            outputType: this.op.outputType
        }
    }
}

function getOpCategories() {
    return Categories
}

function getOpConfigs() {
    return OperationConfig
}

export default {
    Executor: Executor,
    getOpCategories: getOpCategories,
    getOpConfigs: getOpConfigs
}