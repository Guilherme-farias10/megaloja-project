#linha 1860 
from flask import Flask, request, jsonify

app = Flask(__name__)

'''produtos = []
@app.route('/produtos', methods=['POST'])

def criar_produtos():
    dados = request.get_json()

    produto = {"nome": dados["nome"], "preco": dados["preco"], "quantidade": dados["quantidade"]}
    produtos.append(produtos)

    return jsonify(produtos), 201

@app.route('/produtos', methods=['GET'])
def listar_produtos():
    return jsonify(produtos)


if __name__ == '__main__':
    app.run(debug=True)


#linha 1289
pedidos = []

@app.route('/pedidos', methods=['POST'])
def criar_pedidos():

    dados = request.get_json()

    pedido = {
        "id": dados.get("id"),
        "data": dados.get("date"),
        "itens": dados.get("items"),
        "total": dados.get("total"),
        "forma_pagamento": dados.get("paymentMethod"),
        "parcelas": dados.get("installments"),
        "observacao": dados.get("observation"),
        "status": dados.get("status")
    }

    pedidos.append(pedido)

    return jsonify({
        "mensagem": "Pedido criado com sucesso!",
        "pedido": pedido
    }), 201


@app.route('/pedidos', methods=['GET'])
def listar_pedidos():
    return jsonify(pedidos)


if __name__ == '__main__':
    app.run(debug=True)'''

#linha 2255


STATUS_PERMITIDOS = [
    "Confirmado",
    "Em Separação",
    "Pronto para Retirada",
    "Finalizado",
    "Cancelado"
]

@app.route('/pedidos/<pedido_id>/status', methods=['PUT'])
def alterar_status(pedido_id):
    
    dados = request.get_json()

    novo_status = dados.get("status")

    if not novo_status:
        return jsonify({"erro": "Status não informado"}), 400

    if novo_status not in STATUS_PERMITIDOS:
        return jsonify({"erro": "Status inválido" }), 400

    for pedido in pedidos:
        
        if pedido["id"] == pedido_id:
            pedido["status"] = novo_status
            return jsonify({ "mensagem": "Status atualizado com sucesso", "pedido": pedido })

    return jsonify({ "erro": "Pedido não encontrado"}), 404


