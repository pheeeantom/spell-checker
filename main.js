const express = require('express');
const app = express();
const port = 3020;

const fs = require("fs");
const KEYBOARD_COORDS = JSON.parse(fs.readFileSync("./keyboard-coords.json", { encoding: 'utf8', flag: 'r' }));

var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

let getDiff = function(char1, char2) {
    console.log(KEYBOARD_COORDS);
    return Math.sqrt((KEYBOARD_COORDS[char1][0] - KEYBOARD_COORDS[char2][0]) ** 2 +
        (KEYBOARD_COORDS[char1][1] - KEYBOARD_COORDS[char2][1]) ** 2);
}

let tree;
/*
const tree = {
    head: [{
        value: 'к',
        //parent: null,
        next: [{
            value: 'а',
            //parent: tree.head,
            next: [{
                value: 'с',
                //parent: tree.head.next[0],
                next: [{
                    value: 'к',
                    //parent: tree.head.next[0].next[0],
                    next: [{
                        value: 'а',
                        //parent: tree.head.next[0].next[0].next[0],
                        next: [{
                            value: {word: 'каска'},
                            //parent: tree.head.next[0].next[0].next[0].next[0],
                            next: null
                        }]
                    }]
                }],
            },
            {
                value: 'з',
                //parent: tree.head.next[0],
                next: [{
                    value: 'а',
                    //parent: tree.head.next[0].next[1],
                    next: [{
                        value: 'н',
                        //parent: tree.head.next[0].next[1].next[0],
                        next: [{
                            value: {word: 'казан'},
                            //parent: tree.head.next[0].next[1].next[0].next[0],
                            next: [{
                                value: 'ы',
                                //parent: tree.head.next[0].next[1].next[0].next[0].next[0],
                                next: [{
                                    value: {word: 'казаны'},
                                    //parent: tree.head.next[0].next[1].next[0].next[0].next[0].next[0],
                                    next: null
                                }],
                            }]
                        }],
                    }]
                }]
            }]
        }]
    }]
};
tree.head[0].parent = null;
tree.head[0].next[0].parent = tree.head[0];
tree.head[0].next[0].next[0].parent = tree.head[0].next[0];
tree.head[0].next[0].next[0].next[0].parent = tree.head[0].next[0].next[0];
tree.head[0].next[0].next[0].next[0].next[0].parent = tree.head[0].next[0].next[0].next[0];
tree.head[0].next[0].next[0].next[0].next[0].next[0].parent = tree.head[0].next[0].next[0].next[0].next[0];
tree.head[0].next[0].next[1].parent = tree.head[0].next[0];
tree.head[0].next[0].next[1].next[0].parent = tree.head[0].next[0].next[1];
tree.head[0].next[0].next[1].next[0].next[0].parent = tree.head[0].next[0].next[1].next[0];
tree.head[0].next[0].next[1].next[0].next[0].next[0].parent = tree.head[0].next[0].next[1].next[0].next[0];
tree.head[0].next[0].next[1].next[0].next[0].next[0].next[0].parent = tree.head[0].next[0].next[1].next[0].next[0].next[0];
tree.head[0].next[0].next[1].next[0].next[0].next[0].next[0].next[0].parent = tree.head[0].next[0].next[1].next[0].next[0].next[0].next[0];
*/

//m^n где m - длина алфавита, n - средняя длина слова (для английского это 5, для русского 6)
let fixWord = function(tree, weight, searchWord, indexWord, matches, miss) {
    console.log(tree, weight, searchWord, indexWord, matches, miss);
    let res = [];
    if (typeof tree.value === 'object') {
        let substract = 0;
        let lenSearchWord = searchWord.length;
        let additional = lenSearchWord > tree.value.word.length ?
            2 * Math.abs(lenSearchWord - tree.value.word.length) : 0;
        res.push([tree.value, weight - substract, additional]);
        console.log(res[0]);
        console.log(additional, substract);
        indexWord--;
        if (!tree.next) {
            return [res[0][0], res[0][1] + res[0][2]];
        }
    }
    if (!tree.next) return [null, +Infinity];
    //console.log(searchWord.at(indexWord), tree.value.at(0));
    let newWeight = weight + (typeof tree.value === 'object' ? 0 : (
        Math.abs(!searchWord[indexWord] ? 2 :
            /*(searchWord.charCodeAt(indexWord) - tree.value.charCodeAt(0))*/
            getDiff(searchWord.at(indexWord), tree.value.at(0))))
        );
    let wasMatchesIncrement = false;
    for (let i = 0; i < tree.next.length; i++) {
        //optimization
        console.log(indexWord, i, newWeight,
            (typeof tree.next[i].value === 'object' ? 0 : (
                Math.abs(!searchWord[indexWord + 1] ? 2 :
                    /*(searchWord.charCodeAt(indexWord + 1) - tree.next[i].value.charCodeAt(0))*/
                    getDiff(searchWord.at(indexWord + 1), tree.next[i].value.at(0))))
                ), i > 0 ? res[i-1][1] : null);
        if (i > 0 && (newWeight +
            (typeof tree.next[i].value === 'object' ? 0 : (
                Math.abs(!searchWord[indexWord + 1] ? 2 :
                    /*(searchWord.charCodeAt(indexWord + 1) - tree.next[i].value.charCodeAt(0))*/
                    getDiff(searchWord.at(indexWord + 1), tree.next[i].value.at(0))))
                ) > res[i - 1][1])) continue;
        if (newWeight > 50) { res.push([{ word: searchWord }, +Infinity]); continue; }
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
        if (matches >= 2 && indexWord - 2 >= 0) {
            let substract = 0;
            let cur = typeof tree.value === 'object' ? tree.parent : tree;
            for (let j = indexWord; j > indexWord - 3; j--) {
                if (!cur) break;
                console.log(searchWord[j], cur.value)
                substract += /*Math.abs(searchWord.charCodeAt(j) - cur.value.charCodeAt(0));*/
                    getDiff(searchWord.at(j), cur.value.at(0))
                cur = cur && cur.parent ? (
                    typeof cur.parent.value === 'object' ? cur.parent.parent : cur.parent) : null;
            }
            if (substract) {
                searchWord = searchWord.slice(0, indexWord - 1) + searchWord.slice(indexWord);
                console.log(substract, newWeight, indexWord, searchWord, tree.next[i]);
                res.push(fixWord(tree.next[i], newWeight - substract, searchWord, indexWord + 1, 0, false));
            }
            else {
                console.log('hi');
                res.push(fixWord(tree.next[i], newWeight, searchWord, indexWord + 1, matches, miss));
            }
        }
        else {
            console.log('hi', matches, wasMatchesIncrement)
            res.push(fixWord(tree.next[i], newWeight, searchWord, indexWord + 1, matches, miss));
        }
    }
    let min = +Infinity;
    let minWord;
    for (let i = 0; i < res.length; i++) {
        if (res[i][1] + (res[i][2] || 0) < min) { min = res[i][1] + (res[i][2] || 0); minWord = res[i][0]; }
    }
    return [minWord, min];
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/enter_word.html");
});

app.post('/check_spelling', (req, res) => {
    let inputWord = req.body.word;
    console.log(inputWord);
    let answer = [];
    for (let i = 0; i < tree.head.length; i++) {
        answer.push(fixWord(tree.head[i], 0, inputWord, 0, 0, false));
    }
    console.log(answer);
    answer = answer.reduce((acc, cur) => {
        console.log(cur, acc);
        if (cur[1] < acc[1]) {
            return cur;
        }
        else {
            return acc;
        }
    }, [null, +Infinity]);
    console.log(answer);
    res.send(req.body.word + '->' + (answer[1] > 50 ? inputWord : answer[0].word));
});

app.get('/wordlist_to_tree', (req, res) => {
    let tree1 = {
        head: [],
    }
    const wordlist = fs.readFileSync("./test.txt", { encoding: 'utf8', flag: 'r' }).split('\r\n');
    let pointer = tree1.head;
    let prev = null;
    for (let i = 0; i < wordlist.length; i++) {
        console.log(pointer, i);
        for (let j = 0; j < wordlist[i].length; j++) {
            if (typeof pointer[0]?.value === 'object') {
                console.log(111111111);
                //j--;
                //pointer = pointer.next;
                //console.log(pointer);
                console.log(pointer);
                if (!Array.isArray(pointer.next)) {
                    console.log('not array');
                    pointer[0].next = [{value: wordlist[i][j], next: []}];
                }
                else {
                    pointer.push({value: wordlist[i][j], next: []});
                }
                console.log(pointer);
                pointer[0].next[pointer.length - 1].parent = prev;
                prev = pointer[0].next[pointer.length - 1];
                pointer = pointer[0].next[pointer.length - 1].next;
                continue;
            }
            if (!pointer.length || !pointer.find(item => item.value === wordlist[i][j])) {
                console.log(22222222);
                pointer.push({value: wordlist[i][j], next: []});
                console.log('vekver');
                console.log(pointer[pointer.length - 1]);
                console.log(prev);
                pointer[pointer.length - 1].parent = prev;
                prev = pointer[pointer.length - 1];
                pointer = pointer[pointer.length - 1].next;
                continue;
            }
            console.log(333333);
            prev = pointer.find(item => item.value === wordlist[i][j]);
            pointer = pointer.find(item => item.value === wordlist[i][j]).next;
            console.log(pointer);
        }
        //console.log(JSON.stringify(tree1));
        let subs = [];
        if (pointer.length) {
            subs = pointer;
        }
        prev.next = [{value: {word: wordlist[i]}, next: !pointer.length ? null : pointer}];
        pointer = prev.next;
        console.log('vekver2');
        console.log(pointer[pointer.length - 1]);
        console.log(prev);
        pointer[pointer.length - 1].parent = prev;
        for (let sub of subs) {
            sub.parent = pointer[pointer.length - 1];
        }
        //console.log(pointer);
        //console.log(JSON.stringify(tree1));
        pointer = tree1.head;
        prev = null;
    }
    tree = tree1;
    res.send('дерево слов построено, можно начинать работу');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});