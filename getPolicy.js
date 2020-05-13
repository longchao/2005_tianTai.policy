const AUDIT_REQ = {
    "amount": {
        "<=20":     [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        "21-50":    [1, 0, 0, 1, 0, 1, 0, 0, 0, 0],
        "50-100":   [1, 0, 0, 1, 0, 1, 0, 1, 0, 0],
        "100-200":  [1, 0, 0, 1, 0, 1, 0, 1, 1, 0],
        ">=200":    [1, 0, 0, 1, 0, 1, 0, 1, 1, 1],
    },
    "pay_method": {
        "kdfh":     [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        "yhcd<180": [1, 0, 0, 1, 0, 1, 0, 1, 0, 0],
        "yhcd>180": [1, 0, 0, 1, 0, 1, 0, 1, 1, 1],
        "xyz":      [1, 0, 0, 1, 0, 1, 0, 1, 1, 0],
        "hdfk":     [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    },
    "test":{
        "test_opt1": [1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
        "test_opt2": [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
};

// const TEST_CASE = {
//     "amount": "21-50",
//     "pay_method": "xyz"
// }

function getAudit(c) {
    console.log('case', c);
    let auditReqFinal = [0,0,0,0,0,0,0,0,0,0];
    for(let key of Object.keys(AUDIT_REQ)){
        let c_value = c[key];
        let auditReqForThisKey = AUDIT_REQ[key];
        let req = auditReqForThisKey[c_value];
        for(let i =0;i < auditReqFinal.length;i++){
            auditReqFinal[i] = auditReqFinal[i] | req[i];
        }
    }
    return auditReqFinal;
}

function removeFromArray(arr, item) {
    const index = arr.indexOf(item);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

function getOptions(reqs) {
    if(reqs.length== 1){
        return Object.keys(AUDIT_REQ[reqs[0]]).map((item)=>{return `${reqs[0]}.${item}`});
    }
    let result = [];
    for(let r of reqs){
        let otherOpts =  getOptions(removeFromArray(reqs, r));
        for(let k in AUDIT_REQ[r]){
            for(let o of otherOpts){
                result.push(o + `,${r}.${k}`);
            }
        }
    }
    return result;
}

let options = getOptions(Object.keys(AUDIT_REQ));

function getCase(str){
    let result = {};
    let opts = str.split(',');
    for(let opt of opts){
        let parts = opt.split('\.');
        let key = parts[0];
        let value = parts[1];
        result[key] = value;
    }
    return result;
}

let uniqAudit = new Set();
for(let o of options){
    let c = getCase(o);
    let a = getAudit(c);
    uniqAudit.add(JSON.stringify(a));
}

console.log(uniqAudit);

