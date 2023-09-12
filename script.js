const kujiImages = Array.from({ length: 367 }, (_, i) => `url("kuji_images/kuji${String(i + 1).padStart(5, '0')}.jpg")`);
let kujiImagesLoaded = [];

kujiImages.forEach(imageUrl => {
    const img = new Image();
    img.src = imageUrl.substring(5, imageUrl.length - 2);
    img.onload = () => {
        kujiImagesLoaded.push(imageUrl);
    };
});

let switchCount = 0;

function increaseCount() {
    switchCount++;
    document.getElementById("count-display").innerText = switchCount;
}

function hideControls() {
    document.querySelector(".button-container").style.display = "none";
}

function checkForSpecialKuji(imageUrl) {
    if (imageUrl.includes("kuji00001.jpg") ||
        imageUrl.includes("kuji00002.jpg") ||
        imageUrl.includes("kuji00003.jpg") ||
        imageUrl.includes("kuji00004.jpg") ||
        imageUrl.includes("kuji00005.jpg")) {
            
            console.log("特定のおみくじ画像を検出!"); // このログを追加
            hideControls();  // この行を追加
            showCongratulations();
    }
}

function displayRandomKujiImage() {
    const imageDisplayElement = document.getElementById('image-display');
    if (kujiImagesLoaded.length > 0) {
        const randomIndex = Math.floor(Math.random() * kujiImagesLoaded.length);
        const selectedImageUrl = kujiImagesLoaded[randomIndex];
        imageDisplayElement.style.backgroundImage = selectedImageUrl;
        increaseCount();

        // ここで特定のおみくじ画像をチェック
        checkForSpecialKuji(selectedImageUrl);
    }
}

document.getElementById('manual-button').addEventListener('click', function(event) {
    event.stopPropagation();  // この行を追加
    displayRandomKujiImage();
});

let autoInterval = null;

function updateAutoButtonText(isRunning) {
    const autoButton = document.getElementById("auto-button");
    if (isRunning) {
        autoButton.innerHTML = "一旦停止<br>";
    } else {
        autoButton.innerHTML = "オススメ！<br>自動 de<br>おみくじ";
    }
}

function showCongratulations() {
    // おみくじの結果を表示する前に自動切り替えを停止
    if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
        updateAutoButtonText(false);
    }
    
    console.log("showCongratulations関数が呼び出されました"); // このログを追加

    const imageUrl = document.getElementById('image-display').style.backgroundImage;
    document.getElementById('kuji-result').style.backgroundImage = imageUrl;

    document.getElementById('switch-count-result').innerText = `おみくじを引いた回数: ${switchCount}回`;

    // おみくじの枚数(ここでは5と仮定します。実際の値に変更してください)
    const specialKujiCount = 5;
    const percentage = ((specialKujiCount / switchCount) * 100).toFixed(2);
    document.getElementById('percentage-result').innerText = `今回のおみくじ確率: ${percentage}%`;

    document.getElementById('congratulations-modal').style.display = 'block';
}

document.getElementById('congratulations-modal').addEventListener('click', function(event) {
    event.stopPropagation();
});

// おめでとう画面の外側をクリックすると、おめでとう画面が非表示になる
// document.body.addEventListener('click', function() {
    // if (document.getElementById('congratulations-modal').style.display === 'block') {
        // document.getElementById('congratulations-modal').style.display = 'none';
    // }
// });
document.getElementById("retry-button").addEventListener("click", function() {
    // button-containerを再表示する
    document.querySelector(".button-container").style.display = "flex";  // 'flex'にして、もとのレイアウトに戻す

    // カウンターを0に戻す
    document.getElementById("count-display").innerText = "0";

    // おめでとう画面を非表示にする
    document.getElementById("congratulations-modal").style.display = "none";
});

function startAutoKuji() {
    if (autoInterval) {
        clearInterval(autoInterval);
        autoInterval = null;
        updateAutoButtonText(false);
    } else {
        autoInterval = setInterval(() => {
            displayRandomKujiImage();
        }, 500);
        updateAutoButtonText(true);
    }
}

document.getElementById("auto-button").addEventListener("click", startAutoKuji);
