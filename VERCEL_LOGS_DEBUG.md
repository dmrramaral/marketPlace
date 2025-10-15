# 🔍 Guia de Debug e Logs na Vercel

## Por que os logs não aparecem?

### 1. **Função não está sendo executada**
Se sua função serverless não está sendo chamada, não haverá logs.

**Verificar:**
- ✅ A URL está correta?
- ✅ A requisição está chegando ao backend?
- ✅ Há erro de CORS bloqueando a requisição?

### 2. **Configuração incorreta do vercel.json**
Se as rotas não estão configuradas corretamente, a função não é invocada.

**Verificar:**
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"  // ← Certifique-se que aponta para o arquivo correto
    }
  ]
}
```

### 3. **Logs não são mostrados em tempo real**
A Vercel pode demorar alguns segundos para mostrar os logs.

**Solução:**
- Aguarde 5-10 segundos após fazer a requisição
- Recarregue a página de logs

### 4. **Você está olhando o projeto errado**
Certifique-se de que está visualizando os logs do projeto correto.

---

## 📊 Como Visualizar Logs na Vercel

### **Método 1: Dashboard Web**

1. Acesse [vercel.com](https://vercel.com)
2. Clique no seu projeto (exemplo: `market-place-nxm5`)
3. Vá para a aba **"Deployments"**
4. Clique no deployment mais recente
5. Role até a seção **"Function Logs"** ou **"Runtime Logs"**

### **Método 2: Logs em Tempo Real (CLI)**

```bash
# Instalar Vercel CLI (se ainda não instalou)
npm i -g vercel

# Fazer login
vercel login

# Ver logs em tempo real
vercel logs --follow

# Ver logs de um projeto específico
vercel logs <url-do-projeto> --follow

# Exemplo:
vercel logs market-place-nxm5.vercel.app --follow
```

### **Método 3: Logs de Produção vs Preview**

- **Production**: Logs do deployment em produção (main branch)
- **Preview**: Logs dos deployments de teste (outras branches)

Certifique-se de estar vendo os logs do ambiente correto!

---

## 🐛 Técnicas de Debug na Vercel

### **1. Adicionar console.log estratégicos**

```javascript
// No início do index.js
console.log('🚀 Servidor iniciado na Vercel');
console.log('📝 Variáveis de ambiente:', {
  NODE_ENV: process.env.NODE_ENV,
  MONGODB_URI: process.env.MONGODB_URI ? '✅ Configurado' : '❌ Não configurado',
  FRONTEND_URL: process.env.FRONTEND_URL
});

// Antes do CORS
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// Depois do CORS
app.use(cors(corsOptions));
console.log('✅ CORS configurado');
```

### **2. Middleware de Debug Global**

Adicione após `app.use(express.json())`:

```javascript
// Middleware de debug (REMOVER EM PRODUÇÃO!)
app.use((req, res, next) => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📍 ${new Date().toISOString()}`);
  console.log(`📥 ${req.method} ${req.url}`);
  console.log(`🌐 Origin: ${req.headers.origin || 'Sem origem'}`);
  console.log(`🔑 Headers:`, req.headers);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  next();
});
```

### **3. Endpoint de Health Check**

Adicione uma rota simples para testar:

```javascript
// Antes das outras rotas
app.get('/health', (req, res) => {
  console.log('🏥 Health check chamado');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  });
});
```

Depois teste acessando: `https://market-place-nxm5.vercel.app/health`

---

## 🔧 Checklist de Debug CORS

### **1. Verifique as variáveis de ambiente na Vercel**

No dashboard da Vercel:
1. Vá em **Settings** → **Environment Variables**
2. Certifique-se que estão configuradas:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL` = `https://sushi-app-ashen.vercel.app`
   - `NODE_ENV` = `production`

### **2. Redeploy após mudanças**

Sempre que alterar variáveis de ambiente ou o código:

```bash
# Via CLI
vercel --prod

# Ou no dashboard
# Settings → Git → Redeploy
```

### **3. Verifique o CORS no console do navegador**

Abra o DevTools (F12) no frontend e procure por:

```
Access to XMLHttpRequest at 'https://...' from origin 'https://...' 
has been blocked by CORS policy
```

**Se aparecer esse erro:**
- ✅ A requisição **chegou** ao servidor
- ❌ O servidor **rejeitou** por CORS
- 📝 Os logs **devem** aparecer na Vercel

---

## 📋 Comandos Úteis

### **Ver logs das últimas requisições**
```bash
vercel logs
```

### **Ver logs em tempo real**
```bash
vercel logs --follow
```

### **Ver logs de um deployment específico**
```bash
vercel logs <deployment-url>
```

### **Ver logs com mais detalhes**
```bash
vercel logs --output raw
```

### **Filtrar logs por status**
```bash
# Ver apenas erros
vercel logs --status error

# Ver apenas logs de sucesso
vercel logs --status success
```

---

## 🚨 Problemas Comuns

### **1. "No logs found"**

**Causa:** A função não está sendo executada

**Solução:**
- Verifique se a URL está correta
- Teste com `curl` ou Postman
- Adicione um endpoint de health check

### **2. Logs aparecem mas não mostram console.log**

**Causa:** Vercel pode filtrar alguns logs

**Solução:**
- Use `console.error()` em vez de `console.log()`
- Adicione prefixos visíveis: `console.log('🔥 IMPORTANTE:', data)`

### **3. "Function Timeout"**

**Causa:** Função demorando mais de 10s (plano gratuito)

**Solução:**
- Otimize conexões do banco
- Use connection pooling
- Verifique se não há loops infinitos

### **4. Logs mostram erro de conexão MongoDB**

**Causa:** String de conexão incorreta ou IP não autorizado

**Solução:**
- MongoDB Atlas → Network Access → Add IP: `0.0.0.0/0`
- Verifique a string de conexão no `.env` da Vercel

---

## 🎯 Teste Rápido

Execute este teste para verificar se os logs funcionam:

### **1. Adicione no index.js:**
```javascript
app.get('/test-log', (req, res) => {
  console.error('🔥🔥🔥 TESTE DE LOG - Se você vê isso, os logs funcionam!');
  res.json({ message: 'Log enviado! Verifique o dashboard da Vercel.' });
});
```

### **2. Faça deploy:**
```bash
vercel --prod
```

### **3. Acesse no navegador:**
```
https://market-place-nxm5.vercel.app/test-log
```

### **4. Veja os logs:**
```bash
vercel logs --follow
```

**Se não aparecer:** O problema é na configuração do projeto Vercel, não no código!

---

## 📞 Onde Pedir Ajuda

1. **Vercel Discussions**: https://github.com/vercel/vercel/discussions
2. **Stack Overflow**: Tag `vercel`
3. **Discord da Vercel**: https://vercel.com/discord

---

**Última atualização:** 14 de outubro de 2025
