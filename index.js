let startTime, endTime, timer, pauseTime, paused = false, accumulatedPauseTime = 0;

function startStudy() {
    const discipline = document.getElementById('discipline').value;
    const content = document.getElementById('content').value;

    if (!discipline || !content) {
        showAlert('Por favor, insira os dados de Disciplina e Conteúdo.');
        return;
    }

    clearAlert();
    startTime = new Date();
    document.getElementById('startTime').innerText = startTime.toLocaleTimeString();
    timer = setInterval(updateCurrentTime, 1000);
}

function updateCurrentTime() {
    const now = new Date();
    document.getElementById('currentTime').innerText = now.toLocaleTimeString();
    const elapsedTime = new Date(now - startTime - accumulatedPauseTime);
    document.getElementById('elapsedTime').innerText = elapsedTime.toISOString().substr(11, 8);
}

function finalizeStudy() {
    if (!startTime) {
        showAlert('O estudo não foi iniciado.');
        return;
    }

    clearInterval(timer);
    endTime = new Date();
    document.getElementById('endTime').innerText = endTime.toLocaleTimeString();
    const elapsedTime = new Date(endTime - startTime - accumulatedPauseTime);
    document.getElementById('elapsedTime').innerText = elapsedTime.toISOString().substr(11, 8);

    document.getElementById('summaryDiscipline').innerText = document.getElementById('discipline').value;
    document.getElementById('summaryContent').innerText = document.getElementById('content').value;
    document.getElementById('summaryDuration').innerText = elapsedTime.toISOString().substr(11, 8);

    document.getElementById('summaryButton').style.display = 'block';
}

function showAlert(message) {
    const alertDiv = document.getElementById('formAlert');
    alertDiv.innerText = message;
    alertDiv.style.display = 'block';
}

function clearAlert() {
    const alertDiv = document.getElementById('formAlert');
    alertDiv.innerText = '';
    alertDiv.style.display = 'none';
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const discipline = document.getElementById('summaryDiscipline').innerText;
    const content = document.getElementById('summaryContent').innerText;
    const duration = document.getElementById('summaryDuration').innerText;
    doc.text(`Disciplina: ${discipline}`, 10, 10);
    doc.text(`Conteúdo: ${content}`, 10, 20);
    doc.text(`Duração: ${duration}`, 10, 30);
    doc.save('resumo_estudo.pdf');
}

function pauseStudy() {
    if (!paused) {
        pauseTime = new Date();
        paused = true;
        clearInterval(timer);
    }
}

function continueStudy() {
    if (paused) {
        const now = new Date();
        accumulatedPauseTime += (now - pauseTime);
        paused = false;
        timer = setInterval(updateCurrentTime, 1000);
    }
}
