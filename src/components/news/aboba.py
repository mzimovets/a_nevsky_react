from datetime import datetime, timedelta

# Функция для расчёта даты Пасхи
def calculate_easter(year):
    """Вычисление даты Пасхи по алгоритму Александра Шпенка (для православной Пасхи)."""
    a = year % 19
    b = year % 4
    c = year % 7
    d = (19 * a + 15) % 30
    e = (2 * b + 4 * c + 6 * d + 6) % 7
    days = d + e
    if days > 9:
        return datetime(year, 4, days - 9)
    else:
        return datetime(year, 3, 22 + days)

# Функция для расчёта дней, когда нельзя читать сорокоуст
def get_forbidden_dates(year):
    """Возвращает список запрещённых дней для чтения сорокоуста."""
    easter = calculate_easter(year)
    
    # Святки (7 января - 17 января)
    forbidden = [
        (datetime(year, 1, 7), datetime(year, 1, 17))
    ]
    
    # Великая седмица (неделя перед Пасхой)
    forbidden.append((easter - timedelta(days=6), easter - timedelta(days=1)))
    
    # Светлая седмица (неделя после Пасхи)
    forbidden.append((easter, easter + timedelta(days=6)))
    
    return forbidden

# Проверка, можно ли читать сорокоуст в определённый день
def is_allowed_date(date, forbidden_dates):
    for start, end in forbidden_dates:
        if start <= date <= end:
            return False
    return True

# Функция для расчёта даты окончания сорокоуста
def calculate_end_date(start_date, year):
    """Вычисление даты окончания сорокоуста, исключая запрещённые дни."""
    forbidden_dates = get_forbidden_dates(year)
    days_count = 0
    current_date = start_date
    skipped_dates = []  # Список пропущенных дат

    while days_count < 40:
        if is_allowed_date(current_date, forbidden_dates):
            days_count += 1
        else:
            skipped_dates.append(current_date)
        current_date += timedelta(days=1)
    
    # Вывод пропущенных дат
    print("Пропущенные даты (не учитываются):")
    for date in skipped_dates:
        print(date.strftime('%Y-%m-%d'))
    
    return current_date - timedelta(days=1)

# Основной код с вводом даты
try:
    start_date_input = input("Введите дату начала сорокоуста (в формате ГГГГ-ММ-ДД): ")
    start_date = datetime.strptime(start_date_input, '%Y-%m-%d')
    year = start_date.year

    end_date = calculate_end_date(start_date, year)
    print("\nДата окончания сорокоуста:", end_date.strftime('%Y-%m-%d'))

except ValueError:
    print("Ошибка: неверный формат даты. Используйте формат ГГГГ-ММ-ДД.")