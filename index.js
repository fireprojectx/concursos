let startTime, endTime, timer, studyDuration = 0;
let paused = false, pauseTime, accumulatedPauseTime = 0;

function startStudy() {
    const discipline = document.getElementById('discipline').value.trim();
    const content = document.getElementById('content').value.trim();
    if (discipline === '' || content === '') {
        showAlert('Por favor, preencha a Disciplina e o Conteúdo.');
        return;
    }
    clearAlert();
    startTime = new Date();
    document.getElementById('startTime').innerText = startTime.toLocaleTimeString();
    document.getElementById('studyTracking').style.display = 'block';
    timer = setInterval(updateCurrentTime, 1000);
}

function finalizeStudy() {
    endTime = new Date();
    clearInterval(timer);
    const duration = (endTime - startTime - accumulatedPauseTime) / 1000; // in seconds
    studyDuration = duration;
    document.getElementById('studyDuration').innerText = formatDuration(duration);
    addHistory(startTime, document.getElementById('discipline').value, document.getElementById('content').value, studyDuration);
    // Exibir o botão de resumo
    const summaryButton = document.createElement('button');
    summaryButton.innerText = 'Mostrar Resumo';
    summaryButton.onclick = showSummary;
    document.getElementById('studyTracking').appendChild(summaryButton);
}

function showSummary() {
    const discipline = document.getElementById('discipline').value.trim();
    const content = document.getElementById('content').value.trim();
    if (discipline === '' || content === '') {
        showAlert('Por favor, preencha a Disciplina e o Conteúdo.');
        return;
    }
    clearAlert();
    // Exibir o resumo
    document.getElementById('summaryDiscipline').innerText = discipline;
    document.getElementById('summaryContent').innerText = content;
    document.getElementById('summaryDuration').innerText = document.getElementById('studyDuration').innerText;
    document.getElementById('summaryModal').style.display = 'block';
}

function closeSummary() {
    // Fechar o resumo e resetar o formulário
    document.getElementById('summaryModal').style.display = 'none';
    resetForm();
}

function updateCurrentTime() {
    if (!paused) {
        const now = new Date();
        document.getElementById('currentTime').innerText = now.toLocaleTimeString();
    }
}

function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function addHistory(start, discipline, content, duration) {
    if (discipline.trim() && content.trim()) {
        const tableBody = document.getElementById('historyBody');
        const newRow = tableBody.insertRow();
        newRow.insertCell(0).innerText = start.toLocaleDateString();
        newRow.insertCell(1).innerText = discipline;
        newRow.insertCell(2).innerText = content;
        newRow.insertCell(3).innerText = formatDuration(duration);
    }
}

function resetForm() {
    document.getElementById('discipline').value = '';
    document.getElementById('content').value = '';
    document.getElementById('studyTracking').style.display = 'none';
    document.getElementById('startTime').innerText = '';
    document.getElementById('currentTime').innerText = '';
    document.getElementById('studyDuration').innerText = '';
    paused = false;
    accumulatedPauseTime = 0;
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
