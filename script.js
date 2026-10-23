const gameContainer = document.getElementById('gameContainer');
const popupElements = [];

// 1. 방향(edge) 속성 추가: 'top'(위), 'bottom'(아래), 'left'(왼쪽), 'right'(오른쪽)
const itemsData = [
    { img: './popcat.png', url: 'popcat.html', edge: 'left' },  
    { img: './popcat3.png', url: 'popcat3.html', edge: 'bottom' },   
    { img: './popcat4.png', url: 'popcat4.html', edge: 'right' } 
];

itemsData.forEach(data => {
    // 2. div 대신 img 태그로 생성하여 원본 비율을 그대로 가져옴
    const item = document.createElement('img');
    item.classList.add('popup-item');
    item.src = data.img; // background 대신 src로 직접 이미지 삽입
    
    // 3. 이 이미지가 어느 방향에서 나올지 HTML 요소에 저장해 둠
    item.dataset.edge = data.edge;
    
    item.addEventListener('click', () => {
        window.location.href = data.url; // 현재 창에서 이동
        item.style.transform = 'translate(0, 0)';
        setTimeout(() => { item.dataset.isActive = "false"; }, 50);
    });

    item.style.left = '-500px';
    item.style.top = '-500px';
    item.dataset.isActive = "false"; 

    gameContainer.appendChild(item);
    popupElements.push(item);
});

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnPopup() {
    const availablePopups = popupElements.filter(el => el.dataset.isActive === "false");
    if (availablePopups.length === 0) return; 

    const item = availablePopups[getRandomInt(0, availablePopups.length - 1)];
    item.dataset.isActive = "true";

    // 4. 랜덤 방향 대신, 위에서 요소에 저장해둔 방향(edge)을 꺼내 씀
    const edge = item.dataset.edge; 

    // img 태그이므로 이미지마다 가로/세로 크기가 다를 수 있음 -> 실제 렌더링된 크기 측정
    const itemWidth = item.clientWidth || 150;
    const itemHeight = item.clientHeight || 150;
    const containerWidth = gameContainer.clientWidth;
    const containerHeight = gameContainer.clientHeight;

    let startX, startY, endTransform;

    // 5. 방향에 따른 시작 좌표와 튀어나올 거리 계산
    switch (edge) {
        case 'top':
            startX = getRandomInt(0, containerWidth - itemWidth);
            startY = -itemHeight; // 화면 위쪽 밖으로 숨김
            endTransform = `translateY(${itemHeight + 20}px)`; // 아래로 튀어나옴
            break;
        case 'right':
            startX = containerWidth; // 화면 오른쪽 밖으로 숨김
            startY = getRandomInt(0, containerHeight - itemHeight);
            endTransform = `translateX(-${itemWidth + 20}px)`; // 왼쪽으로 튀어나옴
            break;
        case 'bottom':
            startX = getRandomInt(0, containerWidth - itemWidth);
            startY = containerHeight; // 화면 아래쪽 밖으로 숨김
            endTransform = `translateY(-${itemHeight + 20}px)`; // 위로 튀어나옴
            break;
        case 'left':
            startX = -itemWidth; // 화면 왼쪽 밖으로 숨김
            startY = getRandomInt(0, containerHeight - itemHeight);
            endTransform = `translateX(${itemWidth + 20}px)`; // 오른쪽으로 튀어나옴
            break;
    }

    item.style.transition = 'none';
    item.style.transform = 'translate(0, 0)';
    item.style.left = `${startX}px`;
    item.style.top = `${startY}px`;

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            item.style.transition = 'transform 0.3s ease-in-out';
            item.style.transform = endTransform;
        });
    });

    const showDuration = getRandomInt(300, 500); 

    setTimeout(() => {
        if (item.dataset.isActive === "true") {
            item.style.transform = 'translate(0, 0)';
            setTimeout(() => {
                item.dataset.isActive = "false";
            }, 50);
        }
    }, showDuration);
}

// 자동 실행 로직 (기존과 동일)
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        function scheduleNextSpawn() {
            spawnPopup();
            const nextSpawnTime = getRandomInt(500, 1200);
            setTimeout(scheduleNextSpawn, nextSpawnTime);
        }
        scheduleNextSpawn();
    }, 2500); 
});