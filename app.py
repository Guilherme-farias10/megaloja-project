from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


# JS linha 207: 
enderecos = [
    {
        "id": 1,
        "label": "Casa",
        "street": "Rua Principal",
        "number": "123",
        "complement": "Apto 302",
        "city": "Porto Alegre",
        "state": "RS",
        "zip": "90000-000"
    }
]


# JS linha 622: 
carrinho = []


# JS linha 623: 
pedidos_cliente = []

# JS linha 649:
produtos = [
    { "sku": "SKU-1000", "nome": 'Monitor Gamer 24" LED FHD',      "preco": "R$ 899,90",  "quantidade": 25, "categoria": "Informática"      },
    { "sku": "SKU-1013", "nome": "Cafeteira Elétrica Inox",         "preco": "R$ 189,00",  "quantidade": 12, "categoria": "Eletrodomésticos" },
    { "sku": "SKU-1026", "nome": "Smartphone 128GB Ultra",           "preco": "R$ 2499,00", "quantidade": 8,  "categoria": "Celulares"        },
    { "sku": "SKU-1039", "nome": "Fone Bluetooth Noise Cancelling",  "preco": "R$ 349,90",  "quantidade": 3,  "categoria": "Áudio"            },
    { "sku": "SKU-1052", "nome": "Teclado Mecânico RGB",             "preco": "R$ 279,00",  "quantidade": 18, "categoria": "Informática"      },
    { "sku": "SKU-1065", "nome": "Notebook Intel i5 16GB RAM",       "preco": "R$ 4199,00", "quantidade": 6,  "categoria": "Informática"      },
    { "sku": "SKU-1078", "nome": "Liquidificador Turbo 1000W",       "preco": "R$ 159,00",  "quantidade": 0,  "categoria": "Eletrodomésticos" },
    { "sku": "SKU-1091", "nome": 'Smart TV 4K 50" Crystal',          "preco": "R$ 2199,00", "quantidade": 10, "categoria": "TV e Vídeo"       },
    { "sku": "SKU-1104", "nome": "Carregador Rápido GaN 65W",        "preco": "R$ 129,00",  "quantidade": 4,  "categoria": "Acessórios"       },
    { "sku": "SKU-1117", "nome": "Console PlayStation 5 Slim",       "preco": "R$ 3799,00", "quantidade": 2,  "categoria": "Games"            },
]


# JS linha 2018: 
pedidos_funcionario = [
    {
        "id": "PED-9087", "client": "João Silva", "date": "Hoje, 14:30",
        "status": "Pendente", "total": 1250.90, "paymentMethod": "PIX", "store": "Centro",
        "items": [
            { "name": 'Monitor Gamer 24" LED FHD', "qtd": 1, "price": 899.90 },
            { "name": "Teclado Mecânico RGB",       "qtd": 1, "price": 279.00 }
        ]
    },
    {
        "id": "PED-9086", "client": "Maria Oliveira", "date": "Hoje, 14:15",
        "status": "Em Separação", "total": 2849.00,
        "paymentMethod": "Cartão de Crédito", "installments": 3, "store": "Shopping Mall",
        "items": [
            { "name": "Smartphone 128GB Ultra",    "qtd": 1, "price": 2499.00 },
            { "name": "Carregador Rápido GaN 65W", "qtd": 1, "price": 129.00  }
        ]
    },
    {
        "id": "PED-9085", "client": "Carlos Santos", "date": "Hoje, 13:50",
        "status": "Pronto para Retirada", "total": 549.90, "paymentMethod": "PIX", "store": "Zona Norte",
        "items": [
            { "name": "Fone Bluetooth Noise Cancelling", "qtd": 1, "price": 349.90 },
            { "name": "Cafeteira Elétrica Inox",         "qtd": 1, "price": 189.00 }
        ]
    },
    {
        "id": "PED-9084", "client": "Ana Beatriz Ribeiro", "date": "Hoje, 13:10",
        "status": "Em Separação", "total": 4498.00,
        "paymentMethod": "Cartão de Crédito", "installments": 6, "store": "Centro",
        "items": [
            { "name": "Notebook Intel i5 16GB RAM", "qtd": 1, "price": 4199.00 },
            { "name": "Mouse Pad Gamer",            "qtd": 1, "price": 0       }
        ]
    },
    {
        "id": "PED-9083", "client": "Marcos Souza Filhos", "date": "Ontem, 18:45",
        "status": "Finalizado", "total": 2378.00, "paymentMethod": "PIX", "store": "Distrito Boémio",
        "items": [
            { "name": "Console PlayStation 5 Slim", "qtd": 1, "price": 3799.00 }
        ]
    },
    {
        "id": "PED-9082", "client": "Juliana Lima Ramos", "date": "Ontem, 17:20",
        "status": "Cancelado", "total": 0, "paymentMethod": "PIX", "store": "Centro",
        "items": [
            { "name": 'Smart TV 4K 50" Crystal', "qtd": 1, "price": 2199.00 }
        ]
    },
]


# JS linha 472: usuários que fazem login
# JS linha 131: handleRegister, usuários que se cadastram

usuarios = []


# JS linha 2255: saveEmployeeOrderStatus, valida o status antes de salvar

STATUS_PERMITIDOS = ["Pendente", "Em Separação", "Pronto para Retirada", "Finalizado", "Cancelado"]



# FUNÇÃO AUXILIAR DE ESTOQUE
# JS linha 663: getStockStatus(productName)

def get_status_estoque(quantidade):
    if quantidade == 0:
        return { "statusText": "Esgotado",      "badgeClass": "badge-out-stock" }
    elif quantidade <= 5:
        return { "statusText": "Estoque Baixo", "badgeClass": "badge-low-stock" }
    else:
        return { "statusText": "Disponível",    "badgeClass": "badge-in-stock"  }



# AUTENTICAÇÃO
@app.route('/cadastro', methods=['POST'])
def cadastrar():
    dados = request.get_json()
    email = dados.get("email")
    senha = dados.get("password")

    if not email or not senha:
        return jsonify({"erro": "Email e senha são obrigatórios"}), 400

    for u in usuarios:
        if u["email"] == email:
            return jsonify({"erro": "Email já cadastrado"}), 409

    usuario = {
        "id":    len(usuarios) + 1,
        "nome":  dados.get("name", ""),
        "email": email,
        "senha": senha
    }
    usuarios.append(usuario)
    return jsonify({"mensagem": "Cadastro realizado com sucesso!"}), 201



# JS linha 472: No back end: valida email e senha antes de deixar entrar.
@app.route('/login', methods=['POST'])
def login():
    dados = request.get_json()
    email = dados.get("email")
    senha = dados.get("password")

    for u in usuarios:
        if u["email"] == email and u["senha"] == senha:
            return jsonify({
                "mensagem": "Login realizado com sucesso!",
                "usuario": { "id": u["id"], "nome": u["nome"], "email": u["email"] }
            })

    return jsonify({"erro": "Email ou senha incorretos"}), 401



# JS linha 483: No back end: valida credencial do funcionário.
@app.route('/funcionario/login', methods=['POST'])
def login_funcionario():
    dados = request.get_json()
    email = dados.get("email")
    senha = dados.get("password")

    if email and senha:
        return jsonify({"mensagem": "Login de funcionário realizado com sucesso!"})

    return jsonify({"erro": "Informe email e senha"}), 400



# JS linha 162: No back end: salva a nova senha do usuário.
@app.route('/alterar-senha', methods=['PUT'])
def alterar_senha():
    dados = request.get_json()
    email     = dados.get("email")
    nova_senha = dados.get("newPassword")

    if not nova_senha or len(nova_senha) < 6:
        return jsonify({"erro": "A nova senha precisa ter pelo menos 6 caracteres"}), 400

    for u in usuarios:
        if u["email"] == email:
            u["senha"] = nova_senha
            return jsonify({"mensagem": "Senha alterada com sucesso!"})

    return jsonify({"erro": "Usuário não encontrado"}), 404


# ENDEREÇOS DE COBRANÇA
# JS linha 249: function renderBillingAddresses(), No back end: busca os endereços do servidor.

@app.route('/enderecos', methods=['GET'])
def listar_enderecos():
    return jsonify(enderecos)



# JS linha 330: function addBillingAddress(address) No back end: salva o endereço no servidor.

@app.route('/enderecos', methods=['POST'])
def adicionar_endereco():
    dados = request.get_json()
    novo = {
        "id":         len(enderecos) + 1,
        "label":      dados.get("label",      ""),
        "street":     dados.get("street",     ""),
        "number":     dados.get("number",     ""),
        "complement": dados.get("complement", ""),
        "city":       dados.get("city",       ""),
        "state":      dados.get("state",      ""),
        "zip":        dados.get("zip",        "")
    }
    enderecos.append(novo)
    return jsonify({"mensagem": "Endereço adicionado com sucesso!", "endereco": novo}), 201



# JS linha 351: atualiza o endereço no servidor.
@app.route('/enderecos/<int:endereco_id>', methods=['PUT'])
def editar_endereco(endereco_id):
    dados = request.get_json()
    for e in enderecos:
        if e["id"] == endereco_id:
            e["label"]      = dados.get("label",      e["label"])
            e["street"]     = dados.get("street",     e["street"])
            e["number"]     = dados.get("number",     e["number"])
            e["complement"] = dados.get("complement", e["complement"])
            e["city"]       = dados.get("city",       e["city"])
            e["state"]      = dados.get("state",      e["state"])
            e["zip"]        = dados.get("zip",        e["zip"])
            return jsonify({"mensagem": "Endereço atualizado!", "endereco": e})
    return jsonify({"erro": "Endereço não encontrado"}), 404


# JS linha 393: function deleteBillingAddress(index)
# Hoje faz window.billingAddresses.splice(index, 1).
# No back end: remove o endereço do servidor.
# ---------------------------------------------------------------
@app.route('/enderecos/<int:endereco_id>', methods=['DELETE'])
def excluir_endereco(endereco_id):
    for e in enderecos:
        if e["id"] == endereco_id:
            enderecos.remove(e)
            return jsonify({"mensagem": "Endereço removido com sucesso!"})
    return jsonify({"erro": "Endereço não encontrado"}), 404



# ESTOQUE
# JS linha 1791: # busca a lista de produtos do servidor.
# ---------------------------------------------------------------
@app.route('/produtos', methods=['GET'])
def listar_produtos():
    resultado = []
    for p in produtos:
        status = get_status_estoque(p["quantidade"])
        resultado.append({ **p, **status })
    return jsonify(resultado)



# JS linha 1860: salva o novo produto no servidor.

@app.route('/produtos', methods=['POST'])
def criar_produto():
    dados     = request.get_json()
    nome      = dados.get("nome", "").strip()
    preco     = dados.get("preco", "").strip()
    quantidade = int(dados.get("quantidade", 0))

    if not nome or not preco:
        return jsonify({"erro": "Nome e preço são obrigatórios"}), 400

    if not preco.upper().startswith("R$"):
        preco = f"R$ {preco}"

    sku    = f"SKU-{2000 + len(produtos) + 1}"
    status = get_status_estoque(quantidade)

    produto = {
        "sku":        sku,
        "nome":       nome,
        "preco":      preco,
        "quantidade": quantidade,
        "categoria":  dados.get("categoria", "Entrada Manual"),
        **status
    }
    produtos.append(produto)
    return jsonify({"mensagem": "Produto criado com sucesso!", "produto": produto}), 201



# JS linha 1969: atualiza o produto no servidor pelo SKU.

@app.route('/produtos/<sku>', methods=['PUT'])
def editar_produto(sku):
    dados = request.get_json()
    for p in produtos:
        if p["sku"] == sku:
            p["nome"]      = dados.get("nome",      p["nome"])
            p["preco"]     = dados.get("preco",     p["preco"])
            p["categoria"] = dados.get("categoria", p["categoria"])

            if "quantidade" in dados:
                p["quantidade"] = int(dados["quantidade"])
                status = get_status_estoque(p["quantidade"])
                p["statusText"] = status["statusText"]
                p["badgeClass"] = status["badgeClass"]

            return jsonify({"mensagem": "Produto atualizado!", "produto": p})
    return jsonify({"erro": "Produto não encontrado"}), 404


# JS linha 1933: remove o produto do servidor pelo SKU.

@app.route('/produtos/<sku>', methods=['DELETE'])
def excluir_produto(sku):
    for p in produtos:
        if p["sku"] == sku:
            produtos.remove(p)
            return jsonify({"mensagem": "Produto removido com sucesso!"})
    return jsonify({"erro": "Produto não encontrado"}), 404



# PEDIDOS DO CLIENTE



# JS linha 1144:.busca os pedidos do cliente no servidor.

@app.route('/pedidos', methods=['GET'])
def listar_pedidos_cliente():
    return jsonify(pedidos_cliente)



# JS linha 1289, linha 1393, salva o pedido e desconta do estoque.
# JS linha 1405: checkoutItems.forEach — desconta estoque após pedido

@app.route('/pedidos', methods=['POST'])
def criar_pedido():
    dados = request.get_json()

    pedido = {
        "id":            dados.get("id"),
        "date":          dados.get("date"),
        "items":         dados.get("items", []),
        "total":         dados.get("total", 0),
        "paymentMethod": dados.get("paymentMethod", "pix"),
        "installments":  dados.get("installments", 1),
        "observation":   dados.get("observation", ""),
        "status":        dados.get("status", "Confirmado")
    }

    # Desconta do estoque (espelho do JS linha 1405)
    for item in pedido["items"]:
        for p in produtos:
            if p["nome"] == item.get("name"):
                qtd_vendida  = item.get("quantity", 1)
                p["quantidade"] = max(0, p["quantidade"] - qtd_vendida)
                status = get_status_estoque(p["quantidade"])
                p["statusText"] = status["statusText"]
                p["badgeClass"] = status["badgeClass"]
                break

    pedidos_cliente.append(pedido)
    return jsonify({"mensagem": "Pedido criado com sucesso!", "pedido": pedido}), 201



# PEDIDOS DO FUNCIONÁRIO

# JS linha 2046: 
# Hoje lê o array local employeeOrders[], busca os pedidos do funcionário no servidor.

@app.route('/funcionario/pedidos', methods=['GET'])
def listar_pedidos_funcionario():
    return jsonify(pedidos_funcionario)


# JS linha 2255: Hoje faz order.status = selectedStatus.value 
# linha 2278 do JS. atualiza o status do pedido no servidor.

@app.route('/funcionario/pedidos/<pedido_id>/status', methods=['PUT'])
def alterar_status(pedido_id):
    dados      = request.get_json()
    novo_status = dados.get("status")

    if novo_status not in STATUS_PERMITIDOS:
        return jsonify({"erro": f"Status inválido. Use: {STATUS_PERMITIDOS}"}), 400

    for pedido in pedidos_funcionario:
        if pedido["id"] == pedido_id:
            if pedido["status"] == novo_status:
                return jsonify({"erro": f"O pedido já está com o status '{novo_status}'"}), 400
            pedido["status"] = novo_status
            return jsonify({"mensagem": "Status atualizado com sucesso!", "pedido": pedido})

    return jsonify({"erro": "Pedido não encontrado"}), 404



# JS linha 2191: function finishEmployeeSeparation() faz order.status = 'Pronto para Retirada'
# linha 2225 muda o status para Pronto para Retirada no servidor.

@app.route('/funcionario/pedidos/<pedido_id>/separar', methods=['PUT'])
def separar_pedido(pedido_id):
    for pedido in pedidos_funcionario:
        if pedido["id"] == pedido_id:
            if pedido["status"] != "Em Separação":
                return jsonify({"erro": f"Pedido precisa estar 'Em Separação'. Status atual: '{pedido['status']}'"}), 400
            pedido["status"] = "Pronto para Retirada"
            return jsonify({"mensagem": "Pedido separado com sucesso!", "pedido": pedido})
    return jsonify({"erro": "Pedido não encontrado"}), 404



# JS linha 2330: faz order.status = 'Finalizado' 
#  linha 2333 do JS. finaliza o pedido no servidor.

@app.route('/funcionario/pedidos/<pedido_id>/retirada', methods=['PUT'])
def confirmar_retirada(pedido_id):
    for pedido in pedidos_funcionario:
        if pedido["id"] == pedido_id:
            if pedido["status"] != "Pronto para Retirada":
                return jsonify({"erro": f"Pedido precisa estar 'Pronto para Retirada'. Status atual: '{pedido['status']}'"}), 400
            pedido["status"] = "Finalizado"
            return jsonify({"mensagem": "Retirada confirmada! Pedido finalizado.", "pedido": pedido})
    return jsonify({"erro": "Pedido não encontrado"}), 404



if __name__ == '__main__':
    app.run(debug=True)