// https://codetop.cc/api/questions/?page=${N}&search=&ordering=-frequency

let genUrl = (N) => {
    return `https://codetop.cc/api/questions/?page=${N}&search=&ordering=-frequency`
}

let pageRange = {min: 1, max: 50}

let fetchPage = (N) => {
    let url = genUrl(N)
    console.log(`Fetching ${url}...`);
    return fetch(url).then(r => r.json())
}

let fetchAllPages = (range) => {
    let queryPeriod = 1000
    let promises = []
    for (let i = range.min; i <= range.max; i++) {
        promises.push(fetchPage(i))
    }
    return Promise.all(promises)
}

let fetchAllQuestions = () => {
    return fetchAllPages(pageRange).then(pages => {
        let questions = []
        for (let page of pages) {
            console.log("Page: ", page);
            questions = questions.concat(page.list)
        }
        return questions
    })
}

/**
 * Response format:
 * {
 *  count,
 *  list {
 *    id,
 *    value,
 *    leetcode? {
 *      id,
 *      title
 *    }
 *  }
 * }
 */

// Generate a list of {leet_id, value, title}
let genList = (questions) => {
    let list = []
    for (let q of questions) {
        let leetcode = q.leetcode
        if (leetcode) {
            let id = leetcode.id
            let title = leetcode.title
            let value = q.value
            list.push({id, value, title})
        }
    }
    return list
}

// Sort the list by value
let sortList = (list) => {
    return list.sort((a, b) => {
        return b.value - a.value
    })
}

// Print to console
let printList = (list) => {
    let out = ""
    for (let {id, value, title} of list) {
        out += `${id},${value},${title}\n`
    }
    console.log(out)
}

// Main
fetchAllQuestions().then(questions => {
    let list = genList(questions)
    let sortedList = sortList(list)
    printList(sortedList)
})