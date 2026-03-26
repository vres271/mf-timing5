#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SECRETS_DIR="$PROJECT_ROOT/secrets"
CERT_DIR="$SECRETS_DIR"
KEY_FILE="$CERT_DIR/ssl_private.key"
CSR_FILE="$PROJECT_ROOT/ssl_certificate.csr"
CERT_FILE="$CERT_DIR/ssl_certificate.crt"
JWT_KEY_FILE="$SECRETS_DIR/jwt_secret.key"

# =============================================================================
# Справка
# =============================================================================

usage() {
  cat <<EOF
Генерирует секреты и SSL для проекта.

Использование:
  $0 [--force]

Опции:
  --force   - пересоздать всё, даже если файлы уже есть
EOF
  exit 1
}

FORCE=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --force)
      FORCE=true
      shift
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unknown option: $1"
      usage
      ;;
  esac
done

# =============================================================================
# Проверка наличия openssl
# =============================================================================

if ! command -v openssl &> /dev/null; then
  echo "Ошибка: openssl не найден. Установите openssl."
  exit 1
fi

# =============================================================================
# Создание директории secrets/
# =============================================================================

if [[ -d "$SECRETS_DIR" ]]; then
  echo "✓ Директория $SECRETS_DIR уже существует."
else
  echo "→ Создаю директорию $SECRETS_DIR..."
  mkdir -p "$SECRETS_DIR"
fi

# =============================================================================
# Генерация JWT-секрета
# =============================================================================

if [[ -f "$JWT_KEY_FILE" && "$FORCE" != "true" ]]; then
  echo "⚠ Файл JWT-секрета $JWT_KEY_FILE уже существует, пропускаю."
else
  echo "→ Генерирую JWT-секрет: $JWT_KEY_FILE"
  openssl rand -base64 32 > "$JWT_KEY_FILE"
  chmod 600 "$JWT_KEY_FILE"
  echo "✓ Готово."
fi

# =============================================================================
# Генерация SSL-сертификата и ключа
# =============================================================================

if [[ -f "$KEY_FILE" && -f "$CERT_FILE" && "$FORCE" != "true" ]]; then
  echo "⚠ SSL-секреты $KEY_FILE и $CERT_FILE уже существуют, пропускаю."
else
  echo "→ Генерирую SSL-секреты..."

  # 1. Приватный ключ (без пароля, чтобы nginx мог читать)
  openssl genpkey -algorithm RSA -out "$KEY_FILE" -aes256 2>/dev/null || \
    openssl genpkey -algorithm RSA -out "$KEY_FILE"

  # 2. CSR с запросом ввода параметров (Country, Organization, Common Name и т.д.)
  echo "Введите параметры сертификата (Common Name = обычно домен, например localhost):"
  openssl req -new -key "$KEY_FILE" -out "${CERT_DIR}/ssl_certificate.csr"

  # 3. Самоподписанный сертификат на 365 дней
  openssl x509 -req -days 365 -in "$CSR_FILE" \
    -signkey "$KEY_FILE" -out "$CERT_FILE"

  # 4. Очистка временного CSR
  rm -f "${CERT_DIR}/ssl_certificate.csr"

  # 5. Установка прав на ключ
  chmod 600 "$KEY_FILE"

  echo "✓ SSL-секреты созданы:"
  echo "   - $KEY_FILE"
  echo "   - $CERT_FILE"
fi

# =============================================================================
# Вывод итоговых файлов
# =============================================================================

echo
echo "📁 Секреты созданы в:"
echo "   $SECRETS_DIR"
echo
echo "📄 Список файлов:"
ls -la "$SECRETS_DIR"

echo
echo "💡 Далее можно запускать:"
echo "   docker-compose up --build"
