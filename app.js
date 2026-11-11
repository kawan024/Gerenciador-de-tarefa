class Tarefa {
    constructor(titulo, prioridade) {
        this.id = Date.now();
        this.titulo = titulo;
        this.prioridade = prioridade;
        this.concluida = false;
        this.dataCriacao = new Date().toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    }
}

class GerenciadorTarefas {
    constructor() {
        this.tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
        this.init();
        this.initTheme();
    }

    init() {
        document.getElementById('task-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.adicionarTarefa();
        });

        document.getElementById('theme-toggle').addEventListener('click', () => {
            this.alternarTema();
        });

        this.renderizar();
    }

    initTheme() {
        const temaSalvo = localStorage.getItem('theme') || 'light';
        if (temaSalvo === 'dark') {
            document.body.classList.add('dark-mode');
        }
        this.atualizarBotaoTema();
    }

    alternarTema() {
        document.body.classList.toggle('dark-mode');
        const eTemaEscuro = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', eTemaEscuro ? 'dark' : 'light');
        this.atualizarBotaoTema();
    }

    atualizarBotaoTema() {
        const eTemaEscuro = document.body.classList.contains('dark-mode');
        document.getElementById('theme-icon').textContent = eTemaEscuro ? '☀️' : '🌙';
        document.getElementById('theme-text').textContent = eTemaEscuro ? 'Claro' : 'Escuro';
    }

    adicionarTarefa() {
        const inputTitulo = document.getElementById('task-title');
        const selectPrioridade = document.getElementById('task-priority');

        const titulo = inputTitulo.value.trim();
        const prioridade = selectPrioridade.value;

        if (!titulo) return;

        // Validação: Verifica se já existe uma tarefa com o mesmo nome (ignorando maiúsculas/minúsculas)
        const jaExiste = this.tarefas.some(
            t => t.titulo.toLowerCase() === titulo.toLowerCase()
        );

        if (jaExiste) {
            alert('Esta tarefa já foi cadastrada na sua lista!');
            return;
        }

        const novaTarefa = new Tarefa(titulo, prioridade);
        this.tarefas.push(novaTarefa);
        this.salvar();
        
        inputTitulo.value = '';
        this.renderizar();
    }

    alternarConclusao(id) {
        this.tarefas = this.tarefas.map(t => {
            if (t.id === id) t.concluida = !t.concluida;
            return t;
        });
        this.salvar();
        this.renderizar();
    }

    removerTarefa(id) {
        this.tarefas = this.tarefas.filter(t => t.id !== id);
        this.salvar();
        this.renderizar();
    }

    salvar() {
        localStorage.setItem('tarefas', JSON.stringify(this.tarefas));
    }

    renderizar() {
        const listaUI = document.getElementById('task-list');
        listaUI.innerHTML = '';

        if (this.tarefas.length === 0) {
            listaUI.innerHTML = '<li style="color: var(--text-sub); text-align: center; padding: 15px;">Nenhuma tarefa cadastrada.</li>';
            return;
        }

        this.tarefas.forEach(t => {
            const li = document.createElement('li');
            li.className = `task-item ${t.concluida ? 'completed' : ''}`;
            
            li.innerHTML = `
                <div class="task-info">
                    <input type="checkbox" ${t.concluida ? 'checked' : ''} onchange="app.alternarConclusao(${t.id})">
                    <span class="badge badge-${t.prioridade}">${t.prioridade}</span>
                    <span class="title">${t.titulo}</span>
                    <span class="date-text">(${t.dataCriacao})</span>
                </div>
                <button class="btn-delete" onclick="app.removerTarefa(${t.id})">Excluir</button>
            `;

            listaUI.appendChild(li);
        });
    }
}

const app = new GerenciadorTarefas();