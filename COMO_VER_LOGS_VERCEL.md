# 🔍 Como Ver os Logs na Vercel - Passo a Passo

## ⚡ Resposta Rápida

**Por que os logs não aparecem?**

Provavelmente porque:
1. ❌ As requisições estão sendo **bloqueadas pelo CORS** antes de chegar ao código
2. ❌ Você está olhando o **deployment errado** (velho vs novo)
3. ❌ O código não foi **redeployado** após as alterações

---

## 🎯 Passo a Passo para Ver os Logs

### **1️⃣ Faça o Redeploy do Backend**

Primeiro, vamos garantir que o código atualizado está no ar:

```bash
cd BackMarketPlace
vercel --prod
```

**OU** pelo Git:
```bash
git add .
git commit -m "Adiciona logs de debug"
git push origin main
```

A Vercel vai fazer o deploy automaticamente.

---

### **2️⃣ Configure as Variáveis de Ambiente na Vercel**

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto **"market-place-nxm5"**
3. Vá em **Settings** → **Environment Variables**
4. Adicione/verifique:

| Nome | Valor | Ambiente |
|------|-------|----------|
| `MONGODB_URI` | `sua_connection_string_do_mongodb` | Production |
| `JWT_SECRET` | `sua_chave_secreta_jwt` | Production |
| `FRONTEND_URL` | `https://sushi-app-ashen.vercel.app` | Production |
| `NODE_ENV` | `production` | Production |

5. Clique em **"Save"**
6. **IMPORTANTE:** Depois de salvar, faça um **Redeploy** no botão "Redeploy" que vai aparecer

---

### **3️⃣ Teste os Endpoints**

Execute o script de teste:

```bash
test-vercel-logs.bat
```

**OU** teste manualmente no navegador:

1. **Health Check:** https://market-place-nxm5.vercel.app/health
2. **Test CORS:** https://market-place-nxm5.vercel.app/test-cors
3. **Categorias:** https://market-place-nxm5.vercel.app/api/category/categories

Se algum endpoint responder, **OS LOGS DEVEM APARECER!**

---

### **4️⃣ Ver os Logs no Dashboard**

1. Acesse: https://vercel.com/dashboard
2. Clique no projeto **"market-place-nxm5"**
3. Vá na aba **"Deployments"**
4. Clique no **deployment mais recente** (o de cima)
5. Role a página até encontrar **"Function Logs"** ou **"Runtime Logs"**

**Espere 5-10 segundos** - os logs podem demorar um pouco para aparecer!

---

### **5️⃣ Ver os Logs via CLI (Tempo Real)**

```bash
# Instalar Vercel CLI (se ainda não tem)
npm i -g vercel

# Fazer login
vercel login

# Ver logs em tempo real
vercel logs market-place-nxm5.vercel.app --follow
```

Agora deixe esse terminal aberto e faça requisições no frontend ou pelo `test-vercel-logs.bat`.

---

## 🐛 O Que Você Vai Ver nos Logs

Com o código atualizado, você verá logs assim:

```
🚀 Iniciando servidor...
📝 NODE_ENV: production
📝 MONGODB_URI: ✅ Configurado
📝 FRONTEND_URL: https://sushi-app-ashen.vercel.app

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🕐 2025-10-14T10:30:45.123Z
📥 GET /health
🌐 Origin: https://sushi-app-ashen.vercel.app
🔑 User-Agent: Mozilla/5.0...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 Health check chamado!

🔍 CORS: Origem da requisição: https://sushi-app-ashen.vercel.app
🧪 CORS: Testando http://localhost:4200 === https://sushi-app-ashen.vercel.app: false
🧪 CORS: Testando http://localhost:3000 === https://sushi-app-ashen.vercel.app: false
🧪 CORS: Testando https://sushi-app-ashen.vercel.app === https://sushi-app-ashen.vercel.app: true
✅ CORS: Origem PERMITIDA: https://sushi-app-ashen.vercel.app
```

---

## 🚨 Se AINDA NÃO aparecer logs

### **Problema 1: Deploy não atualizou**

**Sintoma:** Você não vê as mensagens com emojis (🚀, 📥, etc.)

**Solução:**
```bash
# Force um novo deploy
vercel --prod --force
```

---

### **Problema 2: Variáveis de ambiente não configuradas**

**Sintoma:** Logs mostram `❌ Não configurado`

**Solução:**
1. Configure as variáveis (passo 2️⃣ acima)
2. Faça um **Redeploy** obrigatório após salvar as variáveis

---

### **Problema 3: CORS bloqueando ANTES de chegar ao código**

**Sintoma:** Erro no console do navegador mas nenhum log na Vercel

**Explicação:** Se o CORS bloqueia na primeira camada (headers do vercel.json), o código Node.js nem é executado!

**Solução temporária - Remover CORS do vercel.json:**

Edite `vercel.json` e **COMENTE** a seção de headers:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
  // COMENTAR ESTA PARTE TEMPORARIAMENTE:
  // "headers": [
  //   {
  //     "source": "/api/(.*)",
  //     "headers": [
  //       { "key": "Access-Control-Allow-Credentials", "value": "true" },
  //       { "key": "Access-Control-Allow-Origin", "value": "*" },
  //       { "key": "Access-Control-Allow-Methods", "value": "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
  //       { "key": "Access-Control-Allow-Headers", "value": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization" }
  //     ]
  //   }
  // ]
}
```

Depois redeploy:
```bash
vercel --prod
```

Agora o CORS será tratado **apenas** pelo código do `index.js`, e você VAI VER OS LOGS!

---

### **Problema 4: Você está vendo o deployment errado**

**Solução:**
1. Dashboard → Deployments
2. **Ordenar por "Latest First"** (mais recente primeiro)
3. Clique no deployment com a data/hora mais recente
4. Se tiver um badge **"Production"**, é o correto

---

## ✅ Checklist Final

- [ ] Código do `index.js` tem os `console.error()` com emojis
- [ ] Fez deploy: `vercel --prod`
- [ ] Variáveis de ambiente configuradas na Vercel
- [ ] Fez **Redeploy** após configurar variáveis
- [ ] Testou o endpoint `/health` no navegador
- [ ] Aguardou 10 segundos após fazer a requisição
- [ ] Está olhando o deployment **mais recente**
- [ ] Se nada funcionar: comentou a seção `headers` do `vercel.json`

---

## 📞 Última Opção

Se AINDA não funcionar, teste com o Vercel CLI em tempo real:

```bash
vercel logs --follow
```

Deixe esse terminal aberto e faça uma requisição. Se não aparecer nada, há um problema na configuração do projeto Vercel (não no código).

Nesse caso:
1. Crie um **novo projeto** na Vercel
2. Importe o repositório novamente
3. Configure as variáveis de ambiente
4. Faça o deploy

---

**Criado em:** 14 de outubro de 2025  
**Projeto:** BackMarketPlace na Vercel
