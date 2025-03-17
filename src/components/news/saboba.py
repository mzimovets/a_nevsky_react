from datetime import date, timedelta

def get_eastern(year: int) -> date:
    """Вычисляем дату Православной Пасхи по новому стилю"""
    c = year % 19
    d = (19 * c + 15) % 30
    a = year % 4
    b = year % 7
    e = (2 * a + 4 * b - d + 34) % 7
    f = d + e + 114
    month = f // 31
    day = (f % 31) + 1
    # Конвертируем из юлианского календаря в григорианский (+13 дней)
    julian_easter = date(year, month, day)
    gregorian_easter = julian_easter + timedelta(days=13)
    return gregorian_easter

def calculate_sorokoust(start_date: date) -> tuple[date, list[tuple[date, str]], date, date, date]:
    """Основная логика расчета сорокоуста"""
    # Определяем Пасху: если начальная дата после Пасхи текущего года, берем следующую
    current_year = start_date.year
    easter_current = get_eastern(current_year)
    if start_date > easter_current:
        EASTER = get_eastern(current_year + 1)
    else:
        EASTER = easter_current

    GREAT_LENT_START = EASTER - timedelta(days=48)
    GREAT_LENT_END = EASTER - timedelta(days=1)  # Окончание в Страстную Пятницу
    CHEESEFARE_WEEK = GREAT_LENT_START - timedelta(days=7)
    
    excluded_dates = {}
    
    # 1. Добавляем среду и пятницу Сырной седмицы
    for day_offset in range(7):
        current_day = CHEESEFARE_WEEK + timedelta(days=day_offset)
        if current_day.weekday() in {2, 4}:
            excluded_dates[current_day] = "Сырная седмица (среда/пятница)"
    
    # 2. Добавляем будние дни Великого поста
    current_day = GREAT_LENT_START
    while current_day < EASTER:
        if current_day.weekday() < 5:
            excluded_dates[current_day] = "Великий пост (будний день)"
        current_day += timedelta(days=1)
    
    # 3. Удаляем исключения для особых дней
    # Великий Четверг
    maundy_thursday = EASTER - timedelta(days=3)
    if maundy_thursday in excluded_dates:
        del excluded_dates[maundy_thursday]
    
    # Благовещение (7 апреля года Пасхи)
    annunciation = date(EASTER.year, 4, 7)
    if annunciation < (EASTER - timedelta(days=7)):
        if annunciation in excluded_dates:
            del excluded_dates[annunciation]
    
    # Считаем 40 действительных дней
    count = 0
    current_day = start_date
    skipped_days = []
    
    while count < 40:
        if current_day in excluded_dates:
            skipped_days.append((current_day, excluded_dates[current_day]))
        else:
            count += 1
        current_day += timedelta(days=1)
    
    return (
        current_day - timedelta(days=1), 
        skipped_days, 
        EASTER,
        GREAT_LENT_START,
        GREAT_LENT_END
    )

# Блок ввода данных
while True:
    try:
        input_str = input("\nВведите дату начала сорокоуста (ДД.ММ.ГГГГ): ").strip()
        day, month, year = map(int, input_str.split('.'))
        start_date = date(year, month, day)
        break
    except ValueError:
        print("Ошибка! Некорректная дата. Пример: 15.02.2024")
    except Exception as e:
        print(f"Ошибка: {e}. Попробуйте снова.")

# Расчет и вывод результатов
end_date, skipped, easter_date, lent_start, lent_end = calculate_sorokoust(start_date)

print("\n" + "="*40)
print(f"Начало сорокоуста: {start_date.strftime('%d.%m.%Y')}")
print(f"Окончание сорокоуста: {end_date.strftime('%d.%m.%Y')}")
print(f"Начало Великого поста: {lent_start.strftime('%d.%m.%Y')}")      # Новая строка
print(f"Окончание Великого поста: {lent_end.strftime('%d.%m.%Y')}")     # Новая строка
print(f"Дата Пасхи: {easter_date.strftime('%d.%m.%Y')}")
print(f"Всего дней: {(end_date - start_date).days + 1}")

if skipped:
    print("\nПропущенные дни:")
    for date_obj, reason in sorted(skipped, key=lambda x: x[0]):
        print(f"  [{date_obj.strftime('%d.%m.%Y')}] {reason}")
else:
    print("\nВсе дни сорокоуста соблюдены без пропусков.")
print("="*40)