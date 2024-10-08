const tree = {
    head: {
        value: 'k',
        //parent: null,
        next: [{
            value: 'a',
            //parent: tree.head,
            next: [{
                value: 's',
                //parent: tree.head.next[0],
                next: [{
                    value: 'k',
                    //parent: tree.head.next[0].next[0],
                    next: [{
                        value: 'a',
                        //parent: tree.head.next[0].next[0].next[0],
                        next: [{
                            value: {word: 'kaska'},
                            //parent: tree.head.next[0].next[0].next[0].next[0],
                            next: null
                        }]
                    }]
                }],
            },
            {
                value: 'z',
                //parent: tree.head.next[0],
                next: [{
                    value: 'a',
                    //parent: tree.head.next[0].next[1],
                    next: [{
                        value: 'n',
                        //parent: tree.head.next[0].next[1].next[0],
                        next: [{
                            value: {word: 'kazan'},
                            //parent: tree.head.next[0].next[1].next[0].next[0],
                            next: [{
                                value: 'y',
                                //parent: tree.head.next[0].next[1].next[0].next[0].next[0],
                                next: [{
                                    value: {word: 'kazany'},
                                    //parent: tree.head.next[0].next[1].next[0].next[0].next[0].next[0],
                                    next: null
                                }],
                            }]
                        }],
                    }]
                }]
            }]
        }]
    }
};
tree.head.parent = null;
tree.head.next[0].parent = tree.head;
tree.head.next[0].next[0].parent = tree.head.next[0];
tree.head.next[0].next[0].next[0].parent = tree.head.next[0].next[0];
tree.head.next[0].next[0].next[0].next[0].parent = tree.head.next[0].next[0].next[0];
tree.head.next[0].next[0].next[0].next[0].next[0].parent = tree.head.next[0].next[0].next[0].next[0];
tree.head.next[0].next[1].parent = tree.head.next[0];
tree.head.next[0].next[1].next[0].parent = tree.head.next[0].next[1];
tree.head.next[0].next[1].next[0].next[0].parent = tree.head.next[0].next[1].next[0];
tree.head.next[0].next[1].next[0].next[0].next[0].parent = tree.head.next[0].next[1].next[0].next[0];
tree.head.next[0].next[1].next[0].next[0].next[0].next[0].parent = tree.head.next[0].next[1].next[0].next[0].next[0];
tree.head.next[0].next[1].next[0].next[0].next[0].next[0].next[0].parent = tree.head.next[0].next[1].next[0].next[0].next[0].next[0];

//m^n где m - длина алфавита, n - средняя длина слова (для английского это 5, для русского 6)
let fixWord = function(tree, weight, searchWord, indexWord, matches, miss) {
    console.log(tree, weight, searchWord, indexWord, matches, miss);
    //console.log(weight);
    let res = [];
    if (typeof tree.value === 'object') {
        //console.log(indexWord);
        //console.log(searchWord.length);
        /*matches++;
        let substract = 0;
        let lenSearchWord = searchWord.length;
        if (matches >= 2 || indexWord - 2 >= 0) {
            let cur = tree.parent.parent;
            for (let j = 0; j < 2; j++) {
                //console.log(cur);
                if (Math.abs(searchWord.charCodeAt(indexWord - j - 2) - cur.value.charCodeAt(0)) < 3) {
                    //console.log(indexWord, j, newWeight);
                    for (let k = indexWord - 1; k < searchWord.length; k++) {
                        console.log(k, k - j);
                        if (k - j <= tree.value.word.length - 1)
                            substract += Math.abs(searchWord.charCodeAt(k) - tree.value.word.charCodeAt(k - j));
                    }
                    //res.push(fixWord(tree.next[i], newWeight - substract, searchWord, indexWord + 1, 0));
                    break;
                }
                else {
                    lenSearchWord--;
                    substract += Math.abs(searchWord.charCodeAt(indexWord - j - 2) - cur.value.charCodeAt(0));
                    cur = cur.parent;
                }
                if (j === 1) {
                    for (let k = indexWord - 1; k < searchWord.length; k++) {
                        if (k - 1 <= tree.value.word.length - 1)
                            substract += Math.abs(searchWord.charCodeAt(k) - tree.value.word.charCodeAt(k - 1));
                    }
                }
            }
        }*/
        let substract = 0;
        let lenSearchWord = searchWord.length;
        /*console.log(searchWord, indexWord, tree.value.word);
        if (searchWord[indexWord + miss] === tree.value) {
            matches++;
        }*/
        /*if (matches >= 2) {
            for (let i = indexWord - 2; i < indexWord + matches - 1; i++) {
                //console.log(searchWord[i], tree.value.word[i]);
                substract += Math.abs(searchWord.charCodeAt(i) - tree.value.word.charCodeAt(i));
            }
            if (substract) lenSearchWord--;
        }*/
        let additional = lenSearchWord > tree.value.word.length ?
            10 * Math.abs(lenSearchWord - tree.value.word.length) : 0;
        //console.log(substract);
        res.push([tree.value, weight - substract, additional]);
        console.log(res[0]);
        console.log(additional, substract);
        indexWord--;
        if (!tree.next) {
            //console.log(res);
            return [res[0][0], res[0][1] + res[0][2]];
        }
    }
    if (!tree.next) return [null, +Infinity];
    let newWeight = weight + (typeof tree.value === 'object' ? 0 : (
        Math.abs(!searchWord[indexWord] ? 10 :
            (searchWord.charCodeAt(indexWord) - tree.value.charCodeAt(0))))
        );
    let wasMatchesIncrement = false;
    for (let i = 0; i < tree.next.length; i++) {
        //optimization
        /*let resClone = JSON.parse(JSON.stringify(res));
        if (indexWord === 1) console.log(resClone, i, newWeight +
            (typeof tree.next[i].value === 'object' ? 0 : (
                Math.abs(!searchWord[indexWord] ? 26 :
                    (searchWord.charCodeAt(indexWord) - tree.next[i].value.charCodeAt(0))))
                ));*/
        console.log(indexWord, i, newWeight,
            (typeof tree.next[i].value === 'object' ? 0 : (
                Math.abs(!searchWord[indexWord + 1] ? 10 :
                    (searchWord.charCodeAt(indexWord + 1) - tree.next[i].value.charCodeAt(0))))
                ), i > 0 ? res[i-1][1] : null);
        if (i > 0 && (newWeight +
            (typeof tree.next[i].value === 'object' ? 0 : (
                Math.abs(!searchWord[indexWord + 1] ? 10 :
                    (searchWord.charCodeAt(indexWord + 1) - tree.next[i].value.charCodeAt(0))))
                ) > res[i - 1][1])) continue;
        if (newWeight > 50) { res.push([{ word: searchWord }, +Infinity]); continue; }
        //console.log(newWeight);
        //optimization
        console.log('hi', matches, wasMatchesIncrement)
        console.log(searchWord[indexWord + miss], tree.value)
        if (!miss && searchWord[indexWord + 1] === tree.value) {
            matches = 1;
            miss = true;
        }
        else if (searchWord[indexWord + miss] === tree.value) {
            console.log('hello')
            if (!wasMatchesIncrement) matches++;
            wasMatchesIncrement = true;
        }
        else if (typeof tree.value !== 'object') {
            matches = 0;
        }
        console.log(tree, matches, i, miss);
        //console.log(matchesCopy, indexWord - 2, tree.value, searchWord[indexWord], miss);
        if (matches >= 2 && indexWord - 2 >= 0) {
            //console.log('pom');
            let substract = 0;
            let cur = typeof tree.value === 'object' ? tree.parent : tree;
            for (let j = indexWord; j > indexWord - 3; j--) {
                if (!cur) break;
                //console.log(searchWord[i], tree.value.word[i]);
                //console.log(cur);
                console.log(searchWord[j], cur.value)
                substract += Math.abs(searchWord.charCodeAt(j) - cur.value.charCodeAt(0));
                cur = cur && cur.parent ? (
                    typeof cur.parent.value === 'object' ? cur.parent.parent : cur.parent) : null;
            }
            if (substract) {
                //console.log(indexWord, searchWord);
                searchWord = searchWord.slice(0, indexWord - 1) + searchWord.slice(indexWord);
                //console.log(searchWord);
                console.log(substract, newWeight, indexWord, searchWord, tree.next[i]);
                res.push(fixWord(tree.next[i], newWeight - substract, searchWord, indexWord + 1, 0, false));
            }
            else {
                console.log('hi');
                res.push(fixWord(tree.next[i], newWeight, searchWord, indexWord + 1, matches, miss));
            }
            //console.log(res[0]);
        }
        else {
            console.log('hi', matches, wasMatchesIncrement)
            res.push(fixWord(tree.next[i], newWeight, searchWord, indexWord + 1, matches, miss));
        }
        /*if (Math.abs(searchWord.charCodeAt(indexWord) - (typeof tree.value === "object" ?
            searchWord.charCodeAt(indexWord) : tree.value.charCodeAt(0)) < 3)) matches++;
        else
            matches = 0;
        if (matches < 2 || indexWord - 2 < 0)
            res.push(fixWord(tree.next[i], newWeight, searchWord, indexWord + 1, matches));
        else {
            let cur = tree.parent.parent;
            let substract = 0;
            let flag = false;
            for (let j = 0; j < 2; j++) {
                if (j === 1 ||
                    Math.abs(searchWord.charCodeAt(indexWord - j - 2) - cur.value.charCodeAt(0)) < 3) {
                    console.log(indexWord, j, newWeight);
                    if (flag) {
                        cur = tree;
                        for (let k = indexWord; k > indexWord - 2; k--) {
                            substract += Math.abs(searchWord.charCodeAt(k) - cur.value.charCodeAt(0));
                            cur = cur.parent;
                        }
                        console.log(newWeight, substract);
                        res.push(fixWord(j === 1 ? tree.parent.parent.parent : tree.parent.parent,
                            newWeight - substract, searchWord.splice(indexWord - j - 2, j + 1),
                            indexWord - j - 2, 0));
                    }
                    else {
                        res.push(fixWord(tree.next[i], newWeight, searchWord, indexWord + 1, matches));
                    }
                    break;
                }
                else {
                    flag = true;
                    substract += Math.abs(searchWord.charCodeAt(indexWord - j - 2) - cur.value.charCodeAt(0));
                    cur = cur.parent;
                }
                //if (j === 1) {
                //    for (let k = indexWord - 1; k < searchWord.length; k++) {
                //        if (k - 1 <= tree.value.word.length - 1)
                //            substract += Math.abs(searchWord.charCodeAt(k) - tree.value.word.charCodeAt(k - 1));
                //   }
                //}
            }
        }*/
    }
    let min = +Infinity;
    let minWord;
    //console.log(res);
    for (let i = 0; i < res.length; i++) {
        if (res[i][1] + (res[i][2] || 0) < min) { min = res[i][1] + (res[i][2] || 0); minWord = res[i][0]; }
    }
    return [minWord, min];
}
//let inputWord = 'kepkr';
//let inputWord = 'kalzalny';
//let inputWord = 'klazlany';
//let inputWord = 'kas';
//let inputWord = 'kaskaa';
let inputWord = 'iduecuifehciueci';
let answer = fixWord(tree.head, 0, inputWord, 0, 0, false);
document.getElementById("answer").innerHTML = answer[1] > 50 ? inputWord : answer[0].word;