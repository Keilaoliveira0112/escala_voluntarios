const voluntarios = [
  { id: 1, nome: "Elaine" },
  { id: 2, nome: "Marcos" },
  { id: 3, nome: "Magali"},
  { id: 4, nome: "Renata Macedo" },
  { id: 5, nome: "Eli Valadares" },
  { id: 6, nome: "Guilherme" },
  { id: 7, nome: "João Vittor" },
  { id: 8, nome: "Elizagela" },
  { id: 9, nome: "Luciana" },
  { id: 10, nome: "Willian" },
  { id: 11, nome: "Paula"},
  { id: 12, nome: "Rafael" },
  { id: 13, nome: "Thifanny" },
  { id: 14, nome: "Davi" },
  { id: 15, nome: "Diogo" },
  { id: 16, nome: "Thiago" },
  { id: 17, nome: "Guilherme" },
  { id: 18, nome: "Gilvan" },
  { id: 19, nome: "Marcos Joel" },
  { id: 20, nome: "Reinaldo" },
  { id: 21, nome: "Cris" },
  { id: 22, nome: "Breno" },
  { id: 23, nome: "Claudia" },
  { id: 24, nome: "Virginia" },
  { id: 25, nome: "Sr. Luiz" },
  { id: 26, nome: "Gisele" },
  { id: 27, nome: "José Henrique" },
  { id: 28, nome: "Beatriz" },
  { id: 29, nome: "Dora" },
  { id: 30, nome: "Isaque" },
  { id: 31, nome: "Gislaine" },
  { id: 32, nome: "Tati Lucas" },
  { id: 33, nome: "Fatima"},
  { id: 34, nome: "Rose"},
  { id: 35, nome: "Robério" },
  { id: 36, nome: "Keila" },
  { id: 37, nome: "Eliza"},
  { id: 38, nome: "Patricia" },
  { id: 39, nome: "Marcia" },
  { id: 40, nome: "Sabrina" },
  { id: 41, nome: "Alberto" },
  { id: 42, nome: "Roga" },
  { id: 43, nome: "Taty" },
  { id: 44, nome: "Lucimara" },
  { id: 45, nome: "Elaine Cem" },
  { id: 46, nome: "Amanda" },
    {id: 47, nome: "Joana" },
  {id: 47, nome: "Eliane" },
  {id: 47, nome: "Danilo" },
  { id: 47, nome: "Diogo - Relacional" },

];

let escala = JSON.parse(localStorage.getItem("escala")) || [];

window.onload = function () {
  const select = document.getElementById("voluntario");
  voluntarios.forEach(v => {
    const option = document.createElement("option");
    option.value = v.id;
    option.textContent = v.nome;
    select.appendChild(option);
  });

  // Atualiza a tabela com dados já salvos, se houver
  atualizarTabela();
};


function getNomeVoluntario(id) {
  const v = voluntarios.find(v => v.id == id);
  return v ? v.nome : "Desconhecido";
}

function podeEscalar(voluntarioId, horario, data) {
  return !escala.some(
    item => item.voluntarioId == voluntarioId && item.horario === horario && item.data === data
  );
}

function escalar() {
  const voluntarioId = document.getElementById("voluntario").value;
  const departamento = document.getElementById("departamento").value;
  const horario = document.getElementById("horario").value;
  const data = document.getElementById("data").value;
  const mensagem = document.getElementById("mensagem");
  


  if (!data) {
    mensagem.textContent = "❗ Por favor, selecione uma data.";
    mensagem.className = "mensagem erro";
    return;
  }

  if (podeEscalar(voluntarioId, horario, data)) {
    escala.push({ voluntarioId, departamento, horario, data });
    localStorage.setItem("escala", JSON.stringify(escala));
    mensagem.textContent = "✅ Voluntário escalado com sucesso!";
    mensagem.className = "mensagem sucesso";
    atualizarTabela();
  } else {
    mensagem.textContent = "❌ Este voluntário já está escalado nesse horário e data.";
    mensagem.className = "mensagem erro";
  }
}

function atualizarTabela() {
  const tabela = document.getElementById("tabelaEscala");
  tabela.innerHTML = "";

  escala.forEach((item, index) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${getNomeVoluntario(item.voluntarioId)}</td>
      <td>${item.departamento}</td>
      <td>${item.horario}</td>
      <td>${item.data}</td>
      <td><button onclick="removerEscala(${index})">Remover</button></td>
    `;
    tabela.appendChild(linha);
  });
}

function removerEscala(index) {
  escala.splice(index, 1); // Remove do array
  localStorage.setItem("escala", JSON.stringify(escala));

  atualizarTabela(); // Atualiza a tabela na tela
}

function exportarParaExcel() {
  let tabela = document.getElementById("tabelaEscala").outerHTML;
  let nomeArquivo = "escala_voluntarios.xls";

  // Corrige formatação para Excel
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Escala</x:Name>
                <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
      </head>
      <body>
        ${tabela}
      </body>
    </html>
  `;

  let blob = new Blob([html], { type: "application/vnd.ms-excel" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = nomeArquivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function exportarParaCSV() {
  let linhas = [["Voluntário", "Departamento", "Horário"]];

  escala.forEach(item => {
    linhas.push([
      getNomeVoluntario(item.voluntarioId),
      item.departamento,
      item.horario
    ]);
  });

  let csvContent = linhas.map(e => e.join(",")).join("\n");

  let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "escala_voluntarios.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

