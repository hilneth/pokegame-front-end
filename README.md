# Pokémon Idle Game - API Front-End

O Pokémon Idle Game é um jogo web interativo baseado em progressão contínua (idle game). O jogador cria uma conta de treinador, seleciona um Pokémon da sua equipe para batalhar em rotas do jogo e assiste às batalhas automáticas em tempo real. Projeto desenvolvido para a Pósgraduação de desenvolvimento de software da PUC-RJ.
Lembrando que o projeto deve ser utilizado em conjunto com o back-end encontrado aqui: https://github.com/hilneth/pokegame-back-end

- Batalha Automática: O Pokémon do jogador ataca o Pokémon selvagem em intervalos regulares.

- Progressão de Nível e Moedas: Ao derrotar adversários, o Pokémon ganha pontos de experiência (XP) e o treinador recebe moedas.

- Captura Automática: Existe uma probabilidade do Pokémon selvagem ser capturado após a derrota e adicionado à Pokédex/Inventário do treinador.

- Classificação (Leaderboard): Ranking dos melhores treinadores baseado na quantidade total de moedas acumuladas.

## Arquitetura da Aplicação
```
┌─────────────────────────────────────────┐
│     Interface Web (Front-End)           │
│     React 18 + TypeScript + Vite        │
└────────────────────┬────────────────────┘
                     │
                     │  Chamadas REST (JSON / Cookies)
                     ▼
┌─────────────────────────────────────────┐        ┌─────────────────────────┐
│      API Back-End (Python / Flask)      ├───────►│  Banco de Dados SQLite  │
└────────────────────┬────────────────────┘        └─────────────────────────┘
                     │
                     │  HTTP GET (IDs 1 a 251)
                     ▼
┌─────────────────────────────────────────┐
│     PokéAPI (API Externa Pública)       │
└─────────────────────────────────────────┘
```

## Execução via Docker
```bash
# Gerar a imagem do container
docker build -t pokeidle-front .

# Executar o container na porta 5000
docker run -d -p 3000:80 --name pokeidle-front pokeidle-front