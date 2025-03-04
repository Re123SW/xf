from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, CallbackQueryHandler
import random

TOKEN = "7738014554:AAFWErHuwAo8dICPh8cB7D0KlVOjmWdnfUQ"  # Заменить на ваш токен

user_scores = {}  # Словарь для хранения очков игроков

# Начало игры
async def start(update: Update, context):
    await update.message.reply_text("Привет! Чтобы начать игру, используй команду /game.")

# Запуск игры
async def game(update: Update, context):
    user_id = update.message.from_user.id
    user_scores[user_id] = 0  # Инициализация счета

    # Создание кнопки для клика
    keyboard = [
        [InlineKeyboardButton("Кликни!", callback_data='click')]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    await update.message.reply_text(
        "Игра началась! Кликни по кнопке, чтобы заработать очки!",
        reply_markup=reply_markup
    )

# Обработка нажатий кнопки
async def button_click(update: Update, context):
    user_id = update.callback_query.from_user.id
    user_scores[user_id] += 1  # Увеличение очков

    # Обновление текста сообщения
    await update.callback_query.answer()  # Подтверждение клика
    await update.callback_query.edit_message_text(
        f"Очки: {user_scores[user_id]}\nКликни снова!"
    )

# Завершение игры и вывод результатов
async def end_game(update: Update, context):
    user_id = update.message.from_user.id
    if user_id not in user_scores:
        await update.message.reply_text("Сначала начни игру командой /game!")
        return
    
    score = user_scores[user_id]
    await update.message.reply_text(f"Игра завершена! Ты набрал {score} очков.")
    del user_scores[user_id]  # Удаляем игрока из игры

def main():
    app = Application.builder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("game", game))
    app.add_handler(CallbackQueryHandler(button_click, pattern='click'))
    app.add_handler(CommandHandler("end", end_game))

    print("Бот запущен...")
    app.run_polling()

if __name__ == "__main__":
    main()
