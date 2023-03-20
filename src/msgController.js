import { handleSign } from "./service/signService.js";

export default function route(msgObj) {
    if (msgObj) {
        let activeObj = msgObj.ext?.attachment?.att_chat_course;
        if (activeObj) {
            switch (activeObj.atype) {
                //sign
                case 0:
                    handleSign(activeObj);
                    break;
            }
        }
    }
}