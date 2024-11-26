// 初期化
let currentPage = 0;
let currentChapter = 1;
const chapters = [];

// 本をスライドイン/アウトする
document.getElementById('toggle-book').addEventListener('click', () => {
    const bookContainer = document.getElementById('book-container');
    if (bookContainer.style.left === '0px') {
        bookContainer.style.left = '-300px';
    } else {
        bookContainer.style.left = '0px';
    }
});

// 外部テキストを読み込む
fetch('content.json')
    .then(response => response.json())
    .then(data => {
        chapters.push(...data.chapters);
        loadChapter(1);
        createTabs();
    })
    .catch(err => console.error('エラー:', err));

// 章を読み込む
function loadChapter(chapter) {
    currentChapter = chapter;
    currentPage = 0;
    updateText();
}

// テキストを更新する
function updateText() {
    const textContainer = document.getElementById('text-container');
    const text = chapters[currentChapter - 1].text;
    const start = currentPage * 500;
    const end = start + 500;
    textContainer.textContent = text.slice(start, end);
}

// ページナビゲーション
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        updateText();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    const text = chapters[currentChapter - 1].text;
    if ((currentPage + 1) * 500 < text.length) {
        currentPage++;
        updateText();
    }
});

// タブを作成する
function createTabs() {
    const rightTabs = document.getElementById('right-tabs');
    const topTabs = document.getElementById('top-tabs');
    rightTabs.innerHTML = '';
    topTabs.innerHTML = '';

    chapters.forEach((chapter, index) => {
        // 右タブ
        const rightTab = document.createElement('button');
        rightTab.textContent = `章 ${index + 1}`;
        rightTab.addEventListener('click', () => loadChapter(index + 1));
        rightTabs.appendChild(rightTab);

        // 上タブ
        chapter.points.forEach(point => {
            const topTab = document.createElement('button');
            topTab.textContent = point.name;
            topTab.addEventListener('click', () => {
                currentChapter = index + 1;
                currentPage = Math.floor(point.position / 500);
                updateText();
            });
            topTabs.appendChild(topTab);
        });
    });
}
