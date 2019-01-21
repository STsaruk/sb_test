window.addEventListener("load", async function () {

    const tabList = document.getElementById('tab-list');
    const tabItems = tabList.querySelectorAll('.tab__item');
    const tabContent = document.getElementById('tab-content');

    const itemsData = [
        {
            id: '0',
            url: 'https://raw.githubusercontent.com/sellbe/test-task/master/data/1.json'

        },
        {
            id: '1',
            url: 'https://raw.githubusercontent.com/sellbe/test-task/master/data/2.json'
        },
        {
            id: '2',
            url: 'https://raw.githubusercontent.com/sellbe/test-task/master/data/3.json'
        },
        {
            id: '3',
            url: 'https://raw.githubusercontent.com/sellbe/test-task/master/data/4.json'
        }
    ];


    const getJsonRes = async (url, method) => {
        const resp = await fetch(url, {method});
        return resp.json();
    };

    function getTabContent(contentData) {
        return `
            <h2 class="tab-content__title">${contentData.title}</h2>
            <p class="tab-content__text">${contentData.content}</p>
        `
    }

    function highlightRepeats(content) {
        let wordCounts = { };
        let words = content.split(' ');

        for(let i = 0; i < words.length; i++)
            wordCounts["_" + words[i]] = (wordCounts["_" + words[i]] || 0) + 1;

        const maxRepeats = Math.max.apply(null, Object.values(wordCounts));
        const mostRepeatedKey = Object.keys(wordCounts).find(key => wordCounts[key] === maxRepeats);
        const mostRepeatedWord = mostRepeatedKey.slice(1, mostRepeatedKey.length);
        const regexWord = new RegExp(mostRepeatedWord, 'gi');

        return content.replace(regexWord, `<span>${mostRepeatedWord}</span>`);
    }

    async function loadTabData(currentTabId, item) {
        const tabsArray = Array.from(tabItems);
        const activeTab = tabsArray.find(item => item.classList.contains('tab__item--active'));
        activeTab.classList.remove('tab__item--active');
        item.classList.add('tab__item--active');

        let contentData;
        const currentTabData = itemsData.find(item => item.id === currentTabId);

        if (!itemsData[currentTabId].title && !itemsData[currentTabId].content) {
            contentData = await getJsonRes(currentTabData.url, 'GET');
            itemsData[currentTabId].title = contentData.title;
            itemsData[currentTabId].content = contentData.content;
        }

        const currentItemData = itemsData[currentTabId];

        currentItemData.content = highlightRepeats(itemsData[currentTabId].content);

        tabContent.innerHTML = getTabContent(currentItemData);
    }

    //load first tab when window loaded
    await loadTabData('0', tabItems[0]);

    tabItems.forEach(function (item) {
        item.addEventListener('click',  async (event) => {
            const currentTabId = event.target.getAttribute('data-tab');
            await loadTabData(currentTabId, item)
        })
    });

});