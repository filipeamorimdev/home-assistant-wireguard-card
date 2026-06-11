# Cartão WireGuard

[English](README.md) · **Português** · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

Um cartão Lovelace limpo e minimalista para o [Home Assistant](https://www.home-assistant.io/) que exibe o estado dos peers WireGuard VPN — estado da ligação, endpoints, estatísticas de transferência e hora do último handshake — atualizado em tempo real a partir de um sensor REST.

---

## Pré-visualização

![WireGuard Card](assets/card.png)


| Peer online | Peer offline |
|---|---|
| Ponto verde · selo `online` · handshake em segundos | Ponto cinzento · selo `offline` · handshake em horas |

Cada cartão de peer mostra:
- **Estado da ligação** — ponto e selo com código de cor
- **Endpoint** — IP pública e porta
- **IPs permitidos** — o endereço de túnel do peer
- **Último handshake** — em formato legível, destacado a verde quando recente
- **Estatísticas de transferência** — rx / tx em unidades legíveis

---

## Requisitos

| Requisito | Notas |
|---|---|
| Home Assistant | 2023.x ou superior |
| Um endpoint da API WireGuard | Deve expor o formato JSON descrito abaixo — instruções de configuração mais adiante |
| HACS | Apenas necessário para o método de instalação via HACS |

---

## Instalação

### Opção A — HACS (recomendado)

1. Abra o HACS na barra lateral do HA
2. Vá para **Frontend**
3. Clique em **⋮ → Repositórios personalizados**
4. Adicione o URL deste repositório e selecione a categoria **Lovelace**
5. Clique em **Download**
6. Faça um refresh forçado do navegador (`Ctrl+Shift+R`)

### Opção B — Manual

1. Faça o download de `wireguard-card.js` a partir da [última versão](../../releases/latest)
2. Copie-o para `/config/www/wireguard-card.js`
3. Vá para **Definições → Painéis → ⋮ → Recursos → Adicionar recurso**
   - URL: `/local/wireguard-card.js`
   - Tipo: `Módulo JavaScript`
4. Faça um refresh forçado do navegador (`Ctrl+Shift+R`)

---

## API

Este cartão lê de um sensor REST que sonda um endpoint JSON. O endpoint deve devolver a seguinte estrutura:

```json
{
  "active_peers": 1,
  "total_peers": 2,
  "peers": {
    "peer-name": {
      "friendly_name": "peer-name",
      "endpoint": "1.2.3.4:51820",
      "allowed_ips": "10.0.0.2/32",
      "latest_handshake": "21 seconds",
      "transfer_rx_human": "3.21 MiB",
      "transfer_tx_human": "137.18 MiB",
      "connected": true
    }
  },
  "updated_at": "2026-05-20T22:55:00.281068+00:00"
}
```

### Campos de topo

| Campo | Obrigatório | Notas |
|---|---|---|
| `peers` | ✅ | Objeto indexado pelo nome do peer. O cartão itera sobre os seus valores |
| `active_peers` | — | Mostrado na estatística do cabeçalho. Recorre ao estado do sensor se omitido |
| `total_peers` | — | Mostrado ao lado de `active_peers`. Recorre ao número de entradas em `peers` se omitido |
| `updated_at` | — | Timestamp ISO mostrado no rodapé. O rodapé fica oculto se omitido |

### Campos por peer

| Campo | Obrigatório | Notas |
|---|---|---|
| `friendly_name` | ✅ | Mostrado como o título do peer |
| `endpoint` | ✅ | Mostrado tal como está (ex: `1.2.3.4:51820`) |
| `allowed_ips` | ✅ | Mostrado tal como está (ex: `10.0.0.2/32`) |
| `latest_handshake` | ✅ | Mostrado tal como está, por isso formate-o como preferir do lado da API |
| `transfer_rx_human` | ✅ | Mostrado tal como está (ex: `3.21 MiB`) |
| `transfer_tx_human` | ✅ | Mostrado tal como está (ex: `137.18 MiB`) |
| `connected` | ✅ | Booleano. Controla o indicador online/offline e o filtro `connected_only` |

Quaisquer campos extra que a sua API devolva (contadores de bytes em bruto, inteiros de "segundos atrás", chaves públicas, etc.) são simplesmente ignorados pelo cartão.


## Configurar o serviço de API de estatísticas WireGuard

Siga estes passos para configurar uma API JSON simples para o estado do WireGuard que se integre com o Home Assistant.

### 1. Criar o script da API

Crie o script da API com o seu editor preferido:

```bash
sudo nano /usr/local/bin/wg-stats.py
```

Pode encontrar um script de exemplo em [`src/wg-stats.py`](src/wg-stats.py).  
Modifique-o conforme necessário para o seu ambiente.

### 2. Tornar o script executável

```bash
sudo chmod +x /usr/local/bin/wg-stats.py
```

### 3. Criar um serviço systemd

Configure um serviço para executar o script automaticamente:

```bash
sudo nano /etc/systemd/system/wg-stats.service
```

Exemplo de [`wg-stats.service`](src/wg-stats.service) disponível neste repositório para referência.  
Certifique-se de atualizar `ExecStart` se o seu caminho do Python for diferente.

### 4. Recarregar o systemd

Recarregue o systemd para que detete o novo serviço:

```bash
sudo systemctl daemon-reload
```

### 5. Ativar o serviço no arranque

Ative o serviço para que seja iniciado no arranque do sistema:

```bash
sudo systemctl enable wg-stats
```

### 6. Iniciar o serviço

Inicie já o serviço de estatísticas do WireGuard:

```bash
sudo systemctl start wg-stats
```

### 7. Verificar que está tudo a funcionar

Verifique o estado do serviço:

```bash
sudo systemctl status wg-stats
```

Deverá ver que o serviço está ativo (a correr).  
Se sim, o endpoint da sua API está pronto a ser usado pelo Home Assistant.

> ⚠️ **Nota de segurança:** O `wg-stats.py` de exemplo escuta em `0.0.0.0:8888` **sem autenticação e sem TLS**, por isso qualquer host na mesma rede pode ler a topologia do seu WireGuard — nomes dos peers, endpoints, IPs permitidos e estatísticas de transferência. Antes de o expor, considere uma ou mais das seguintes opções:
> - Vincule a uma interface específica (por exemplo, altere o endereço de escuta de `0.0.0.0` para `127.0.0.1` ou para o IP só da sua LAN) para que não fique acessível a partir de redes não confiáveis.
> - Restrinja o acesso com uma regra de firewall que permita apenas o seu host do Home Assistant.
> - Nunca exponha a porta `8888` diretamente à internet. Se precisar de acesso remoto, coloque-a atrás de um proxy reverso com autenticação/TLS, ou aceda através da própria VPN.

---

## Configuração do sensor

Adicione o seguinte ao seu `configuration.yaml`:

```yaml
sensor:
  - platform: rest
    name: vpn_stats
    unique_id: wireguard_vpn_stats
    resource: http://<o-seu-host-da-api>:<porta>
    scan_interval: 10
    value_template: "{{ value_json.active_peers }}"
    unit_of_measurement: peers
    json_attributes:
      - active_peers
      - total_peers
      - peers
      - updated_at
```

Substitua `<o-seu-host-da-api>:<porta>` pelo endereço da sua API WireGuard.

| Campo | Descrição |
|---|---|
| `unique_id` | Permite a gestão da entidade pela UI |
| `scan_interval` | Frequência de sondagem em segundos — 10 é um valor por defeito sensato |
| `value_template` | Define o estado do sensor como a contagem de peers ativos |
| `unit_of_measurement` | Etiqueta o valor do estado no histórico e no diário |
| `json_attributes` | Extrai os dados aninhados para atributos da entidade para o cartão ler |

Após editar `configuration.yaml`, recarregue a sua configuração do HA (**Ferramentas de Programador → YAML → Recarregar todo o YAML**) ou reinicie o Home Assistant.

---

## Configuração do cartão

Adicione o cartão a qualquer painel Lovelace:

```yaml
type: custom:wireguard-card
entity: sensor.vpn_stats
```

Quando adiciona o cartão pelo seletor de cartões, a primeira entidade `sensor.*` cujo ID contenha `vpn` é pré-selecionada — normalmente `sensor.vpn_stats` — por isso muitas vezes pode confirmar sem alterar nada.

### Opções

| Opção | Obrigatório | Por defeito | Descrição |
|---|---|---|---|
| `entity` | ✅ | — | A entidade `sensor.vpn_stats` criada acima |
| `title` | — | _localizado_ `"WireGuard VPN"` | Texto personalizado mostrado como o título do cabeçalho do cartão. Se omitido, é usado o valor por defeito localizado |
| `connected_only` | — | `false` | Quando `true`, oculta peers cujo campo `connected` não seja `true`, deixando apenas os atualmente ligados |
| `language` | — | _idioma do utilizador do Home Assistant_ | Força o idioma da UI do cartão. Veja [Idiomas](#idiomas) para valores suportados. Se omitido, o cartão usa o idioma do utilizador do Home Assistant e recorre ao inglês se não for suportado |

Exemplo com um título personalizado, peers offline ocultados e a UI forçada para português:

```yaml
type: custom:wireguard-card
entity: sensor.vpn_stats
title: VPN de Casa
connected_only: true
language: pt
```

### Editor visual

O cartão inclui um editor visual, para que possa configurá-lo diretamente pela UI do painel sem mexer no YAML:

- **Entidade do sensor** — menu pendente para escolher a entidade `sensor.vpn_stats`
- **Título do cartão** — campo de texto opcional para sobrepor o título do cabeçalho; deixe vazio para usar o valor por defeito localizado
- **Apenas conectados** — opção para ocultar peers offline do cartão
- **Idioma** — menu pendente para sobrepor o idioma do cartão; por defeito `Automático (idioma do Home Assistant)`

### Idiomas

O cartão atualmente traduz as suas etiquetas para os seguintes idiomas:

| Código | Idioma |
|---|---|
| `en` | English (recurso por defeito) |
| `pt` | Português |
| `es` | Español |
| `fr` | Français |
| `de` | Deutsch |

Comportamento:

- Se `language` estiver definido na configuração do cartão e corresponder a um dos códigos acima, esse idioma é usado.
- Caso contrário, o cartão lê `hass.locale.language` (o idioma do utilizador do Home Assistant). Sufixos regionais como `pt-BR` ou `en-US` são reduzidos ao seu idioma base (`pt`, `en`).
- Se o idioma resolvido não estiver na lista acima, o cartão recorre ao inglês.
- O timestamp do rodapé também é formatado com `toLocaleString(language)`, por isso o formato da data/hora segue o idioma resolvido.

> As strings `latest_handshake`, `transfer_rx_human` e `transfer_tx_human` vêm da API tal como estão. Para as obter no seu idioma terá de as localizar no seu serviço `wg-stats.py` (ou equivalente).

---

## Resolução de problemas

**O cartão mostra "Entity not found"**
→ Verifique se o sensor está carregado e se o ID da entidade corresponde exatamente (`sensor.vpn_stats` por defeito).

**Peers não aparecem**
→ Confirme que `peers` está listado em `json_attributes` na configuração do sensor e que a API está a devolver um objeto JSON válido sob essa chave.

**Os dados estão desatualizados**
→ Verifique o timestamp `updated_at` mostrado no fundo do cartão. Se não estiver a atualizar, verifique se a API está acessível a partir do HA e se `scan_interval` está definido.

**O cartão não aparece no seletor de cartões**
→ Certifique-se de que o recurso foi adicionado corretamente e que fez um refresh forçado (`Ctrl+Shift+R`).

---

## Contribuir

Pull requests são bem-vindas. Por favor, abra primeiro uma issue para alterações significativas.
