export type LocalizedString = {
  bg: string;
  en: string;
};

export const translations = {
  // Sidebar
  "sidebar.businessName": { bg: "My Barbershop", en: "My Barbershop" },
  "sidebar.uploadLogo": { bg: "Качи лого (скоро)", en: "Upload logo (soon)" },
  "sidebar.locations": { bg: "Локации", en: "Locations" },
  "sidebar.addLocation": { bg: "Добави нова локация", en: "Add new location" },
  "sidebar.addLocationSoon": {
    bg: "Скоро: добавяне на нова локация",
    en: "Coming soon: add a new location",
  },
  "sidebar.chooseLocation": {
    bg: "Изберете локация",
    en: "Choose a location",
  },
  "sidebar.demoFooter": {
    bg: "Демо режим — данните са локални",
    en: "Demo mode — data is local",
  },
  "sidebar.gotoToday": { bg: "Към днешен ден", en: "Jump to today" },
  "sidebar.prevMonth": { bg: "Предходен месец", en: "Previous month" },
  "sidebar.nextMonth": { bg: "Следващ месец", en: "Next month" },

  // Nav
  "nav.calendar": { bg: "Календар", en: "Calendar" },
  "nav.reports": { bg: "Отчети", en: "Reports" },
  "nav.clients": { bg: "Клиенти", en: "Clients" },
  "nav.team": { bg: "Екип", en: "Team" },
  "nav.services": { bg: "Услуги", en: "Services" },
  "nav.finance": { bg: "Финанси", en: "Finance" },
  "nav.inventory": { bg: "Стоки", en: "Inventory" },
  "nav.settings": { bg: "Настройки", en: "Settings" },
  "nav.soon": { bg: "скоро", en: "soon" },
  "nav.new": { bg: "ново", en: "new" },

  // Topbar
  "top.toSite": { bg: "← На сайта", en: "← Back to site" },
  "top.ownerProfile": { bg: "Моят профил", en: "My profile" },

  // View As
  "viewAs.label": { bg: "Гледай като", en: "View as" },
  "viewAs.owner": { bg: "Собственик", en: "Owner" },
  "viewAs.ownerDescUnlocked": {
    bg: "Пълен достъп до всички локации и данни",
    en: "Full access to all locations and data",
  },
  "viewAs.ownerDescLocked": {
    bg: "Изисква се парола",
    en: "Password required",
  },
  "viewAs.barbersHeader": {
    bg: "Бръснари — само техния график",
    en: "Barbers — their own schedule only",
  },
  "viewAs.ownerBadge": { bg: "Собственик", en: "Owner" },
  "viewAs.barberBadge": { bg: "Бръснар", en: "Barber" },

  // Password modal
  "password.title": { bg: "Достъп до собственик", en: "Owner access" },
  "password.subtitle": {
    bg: "Въведи парола, за да преминеш в изглед на собственика.",
    en: "Enter the password to switch to the owner view.",
  },
  "password.field": { bg: "Парола", en: "Password" },
  "password.hint": { bg: "Демо парола:", en: "Demo password:" },
  "password.error": {
    bg: "Грешна парола. Опитай отново.",
    en: "Wrong password. Try again.",
  },
  "password.cancel": { bg: "Отказ", en: "Cancel" },
  "password.submit": { bg: "Влез", en: "Sign in" },

  // Notification bell
  "bell.title": { bg: "Известия", en: "Notifications" },
  "bell.ownerHeader": {
    bg: "Заявки за отсъствие",
    en: "Time-off requests",
  },
  "bell.barberHeader": { bg: "Моите заявки", en: "My requests" },
  "bell.empty.owner": { bg: "Няма заявки", en: "No requests" },
  "bell.empty.barber": {
    bg: "Все още нямаш изпратени заявки",
    en: "You have no requests yet",
  },
  "bell.approve": { bg: "✓ Одобри", en: "✓ Approve" },
  "bell.reject": { bg: "✗ Откажи", en: "✗ Reject" },
  "bell.cancelRequest": { bg: "Откажи заявката", en: "Cancel request" },

  // Time-off statuses
  "timeOff.status.pending": { bg: "Чака", en: "Pending" },
  "timeOff.status.approved": { bg: "Одобрена", en: "Approved" },
  "timeOff.status.rejected": { bg: "Отказана", en: "Rejected" },

  // Time-off reasons
  "timeOff.reason.vacation": { bg: "Отпуска", en: "Vacation" },
  "timeOff.reason.course": {
    bg: "Курс / обучение",
    en: "Course / training",
  },
  "timeOff.reason.sick": { bg: "Болничен", en: "Sick leave" },
  "timeOff.reason.personal": { bg: "Лична причина", en: "Personal" },
  "timeOff.reason.other": { bg: "Друго", en: "Other" },

  // Time-off form
  "timeOff.title": {
    bg: "🏖️ Заявка за отсъствие",
    en: "🏖️ Time-off request",
  },
  "timeOff.subtitle": {
    bg: "Собственикът ще получи известие за одобрение",
    en: "The owner will be notified for approval",
  },
  "timeOff.fromDate": { bg: "Дата от *", en: "Start date *" },
  "timeOff.toDate": { bg: "Дата до *", en: "End date *" },
  "timeOff.reason": { bg: "Причина *", en: "Reason *" },
  "timeOff.notes": {
    bg: "Допълнително (по желание)",
    en: "Additional (optional)",
  },
  "timeOff.notesPlaceholder": {
    bg: "напр. семинар в чужбина; ще предам клиентите на Иван...",
    en: "e.g. seminar abroad; I'll hand over my clients to Ivan...",
  },
  "timeOff.error.dates": {
    bg: "Крайната дата трябва да е след началната.",
    en: "End date must be after start date.",
  },
  "timeOff.cancel": { bg: "Отказ", en: "Cancel" },
  "timeOff.submit": { bg: "Изпрати заявката", en: "Submit request" },
  "timeOff.outOfOffice": { bg: "ОТСЪСТВА", en: "OFF" },
  "timeOff.requestButton": {
    bg: "🏖️ Заявка за отсъствие",
    en: "🏖️ Request time off",
  },

  // Toolbar
  "toolbar.prevDay": { bg: "Предишен ден", en: "Previous day" },
  "toolbar.nextDay": { bg: "Следващ ден", en: "Next day" },
  "toolbar.today": { bg: "Днес", en: "Today" },
  "toolbar.allBarbers": {
    bg: "Всички бръснари ({count})",
    en: "All barbers ({count})",
  },

  // Status legend
  "status.confirmed": { bg: "Записан", en: "Booked" },
  "status.inProgress": { bg: "В момента", en: "In progress" },
  "status.completed": { bg: "Платено", en: "Paid" },
  "status.noShow": { bg: "Не дойде", en: "No show" },
  "status.cancelled": { bg: "Отказан", en: "Cancelled" },
  "status.currentTime": { bg: "Текущ час", en: "Current time" },
  "status.hint": {
    bg: "💡 Влачи за преместване · долен край за смяна на времетраене",
    en: "💡 Drag to move · bottom edge to resize",
  },

  // Calendar — hover marker
  "calendar.newSlot": { bg: "+ Нов час", en: "+ New slot" },
  "calendar.resizeHandle": {
    bg: "Влачи за смяна на времетраене",
    en: "Drag to change duration",
  },
  "calendar.offHours": { bg: "Извън работно време", en: "Off hours" },
  "calendar.noteIcon": { bg: "📝", en: "📝" },

  // New appointment modal
  "newAppt.title": { bg: "Нов час", en: "New appointment" },
  "newAppt.firstName": { bg: "Име *", en: "First name *" },
  "newAppt.lastName": { bg: "Фамилия *", en: "Last name *" },
  "newAppt.phone": { bg: "Телефон *", en: "Phone *" },
  "newAppt.email": { bg: "Имейл", en: "Email" },
  "newAppt.service": { bg: "Услуга", en: "Service" },
  "newAppt.notes": { bg: "Бележка", en: "Note" },
  "newAppt.notesPlaceholder": {
    bg: "напр. ще закъснее с 10 мин...",
    en: "e.g. running 10 minutes late...",
  },
  "newAppt.firstNamePlaceholder": { bg: "Иван", en: "John" },
  "newAppt.lastNamePlaceholder": { bg: "Петров", en: "Smith" },
  "newAppt.barberHint": {
    bg: "Като бръснар събираш само име на клиента. Собственикът може да допълни телефон и имейл по-късно.",
    en: "As a barber you only collect the client's name. The owner can fill in phone and email later.",
  },
  "newAppt.cancel": { bg: "Отказ", en: "Cancel" },
  "newAppt.submit": { bg: "Запиши часа", en: "Book appointment" },

  // Details modal
  "details.service": { bg: "Услуга", en: "Service" },
  "details.phone": { bg: "Телефон", en: "Phone" },
  "details.email": { bg: "Имейл", en: "Email" },
  "details.note": { bg: "Бележка", en: "Note" },
  "details.locked": {
    bg: "🔒 Лични данни на клиента се виждат само от собственика",
    en: "🔒 Client's personal data is visible only to the owner",
  },
  "details.changeStatus": { bg: "Промени статуса", en: "Change status" },
  "details.statusActive": { bg: "(текущ)", en: "(current)" },
  "details.action.confirmed": { bg: "Записан", en: "Booked" },
  "details.action.confirmedDesc": {
    bg: "Чака се да дойде",
    en: "Waiting for client",
  },
  "details.action.inProgress": { bg: "Дошъл", en: "Arrived" },
  "details.action.inProgressDesc": {
    bg: "В момента се обслужва",
    en: "Currently being served",
  },
  "details.action.completed": { bg: "Платено", en: "Paid" },
  "details.action.completedDesc": {
    bg: "Услугата приключи",
    en: "Service completed",
  },
  "details.action.noShow": { bg: "Не дойде", en: "No show" },
  "details.action.noShowDesc": {
    bg: "Клиентът пропусна часа",
    en: "Client missed the appointment",
  },
  "details.close": { bg: "Затвори", en: "Close" },

  // Move confirm
  "move.title": { bg: "Преместване на час?", en: "Move appointment?" },
  "move.from": { bg: "От", en: "From" },
  "move.to": { bg: "На", en: "To" },
  "move.cancel": { bg: "Отказ", en: "Cancel" },
  "move.confirm": { bg: "Премести", en: "Move" },

  // Product sale section
  "products.title": { bg: "Продажба на продукт", en: "Sell a product" },
  "products.searchPlaceholder": {
    bg: "Търси продукт (помада, восък, бранд...)",
    en: "Search product (pomade, wax, brand...)",
  },
  "products.noMatch": {
    bg: "Няма продукт, който отговаря на „{query}“",
    en: "No product matches \"{query}\"",
  },
  "products.commissionPct": {
    bg: "комисионна {pct}%",
    en: "{pct}% commission",
  },
  "products.deletedProduct": { bg: "Изтрит продукт", en: "Deleted product" },
  "products.commissionLine": {
    bg: "+{amount} лв комисионна ({pct}%)",
    en: "+{amount} BGN commission ({pct}%)",
  },
  "products.removeSale": { bg: "Премахни продажба", en: "Remove sale" },
  "products.totalLabel": {
    bg: "Общо продукти ({count})",
    en: "Products total ({count})",
  },
  "products.commissionTotal": {
    bg: "комисионна {amount} лв",
    en: "{amount} BGN commission",
  },

  // Reports page
  "reports.title": { bg: "Отчети", en: "Reports" },
  "reports.subtitle.owner": {
    bg: "Преглед за локация {location}",
    en: "Overview for {location}",
  },
  "reports.subtitle.barber": {
    bg: "Личен преглед — {name}",
    en: "Personal overview — {name}",
  },
  "reports.kpi.appointments": { bg: "Часове", en: "Appointments" },
  "reports.kpi.revenue": { bg: "Приходи", en: "Revenue" },
  "reports.kpi.newClients": { bg: "Нови клиенти", en: "New clients" },
  "reports.kpi.returningRate": {
    bg: "Повторни визити",
    en: "Returning rate",
  },
  "reports.kpi.vsPrevious": {
    bg: "спрямо предходния период",
    en: "vs. previous period",
  },
  "reports.chart.labelHours": { bg: "Часове по дни", en: "Appointments by day" },
  "reports.chart.last14": { bg: "Последни 14 дни", en: "Last 14 days" },
  "reports.chart.legendHours": { bg: "Часове", en: "Appointments" },
  "reports.top.services": { bg: "Топ услуги (днес)", en: "Top services (today)" },
  "reports.top.servicesUnit": { bg: "час", en: "appt" },
  "reports.top.servicesUnitPlural": { bg: "часа", en: "appts" },
  "reports.team.title": {
    bg: "Дневен оборот по бръснар",
    en: "Daily turnover per barber",
  },
  "reports.team.subtitle": {
    bg: "услуги + продукти",
    en: "services + products",
  },
  "reports.team.hour": { bg: "час", en: "appt" },
  "reports.team.hours": { bg: "часа", en: "appts" },
  "reports.team.product": { bg: "продукт", en: "product" },
  "reports.team.products": { bg: "продукта", en: "products" },
  "reports.team.servicesLine": { bg: "Услуги: {amount} лв", en: "Services: {amount} BGN" },
  "reports.team.productsLine": {
    bg: "+ Продукти: {amount} лв",
    en: "+ Products: {amount} BGN",
  },
  "reports.team.commissionLine": {
    bg: "Комисионна: {amount} лв",
    en: "Commission: {amount} BGN",
  },
  "reports.products.title": {
    bg: "Продажби на продукти (днес)",
    en: "Product sales (today)",
  },
  "reports.products.subtitle": {
    bg: "комисионни за екипа: {amount} лв",
    en: "team commissions: {amount} BGN",
  },
  "reports.products.salesCount": {
    bg: "{count} продажба",
    en: "{count} sale",
  },
  "reports.products.salesCountPlural": {
    bg: "{count} продажби",
    en: "{count} sales",
  },
  "reports.products.empty": {
    bg: "Все още няма продадени продукти днес. Отвори час от календара и добави продажба на продукт от долната секция.",
    en: "No products sold today yet. Open an appointment from the calendar and add a product sale from the section below.",
  },
  "reports.products.timesSold": {
    bg: "{count} продажба",
    en: "{count} sale",
  },
  "reports.products.timesSoldPlural": {
    bg: "{count} продажби",
    en: "{count} sales",
  },

  // Common
  "common.bgn": { bg: "лв", en: "BGN" },
  "common.close": { bg: "Затвори", en: "Close" },
  "common.cancel": { bg: "Отказ", en: "Cancel" },
  "common.save": { bg: "Запиши", en: "Save" },

  // Language switcher
  "lang.label": { bg: "Език", en: "Language" },
  "lang.bg": { bg: "Български", en: "Bulgarian" },
  "lang.en": { bg: "Английски", en: "English" },

  // Inventory page
  "inventory.title": { bg: "Стоки", en: "Inventory" },
  "inventory.subtitle": {
    bg: "Управление на продуктовия каталог и складовите наличности",
    en: "Manage product catalog and stock levels",
  },
  "inventory.addProduct": { bg: "+ Нов продукт", en: "+ New product" },
  "inventory.scanBarcode": { bg: "📷 Сканирай баркод", en: "📷 Scan barcode" },
  "inventory.scanning": { bg: "Сканиране…", en: "Scanning…" },
  "inventory.searchPlaceholder": {
    bg: "Търси по име, бранд, баркод…",
    en: "Search by name, brand, barcode…",
  },
  "inventory.filterLowStock": {
    bg: "Само критично малко",
    en: "Low stock only",
  },
  "inventory.lowStockBanner": {
    bg: "⚠️ {count} продукт(а) под критичен запас — време е за поръчка",
    en: "⚠️ {count} product(s) below low-stock threshold — time to reorder",
  },
  "inventory.empty": {
    bg: "Няма продукти. Добави първия си продукт.",
    en: "No products yet. Add your first product.",
  },
  "inventory.noMatch": {
    bg: "Няма продукти, отговарящи на търсенето.",
    en: "No products match your search.",
  },
  "inventory.stockUnit": { bg: "бр.", en: "units" },
  "inventory.outOfStock": { bg: "Изчерпано", en: "Out of stock" },
  "inventory.critical": { bg: "Критично", en: "Critical" },
  "inventory.low": { bg: "Малко", en: "Low" },
  "inventory.healthy": { bg: "Налично", en: "In stock" },
  "inventory.cost": { bg: "Закупна", en: "Cost" },
  "inventory.retail": { bg: "Продажна", en: "Retail" },
  "inventory.profit": { bg: "Печалба/бр", en: "Profit/unit" },
  "inventory.commission": { bg: "Комисионна", en: "Commission" },
  "inventory.edit": { bg: "Редактирай", en: "Edit" },
  "inventory.delete": { bg: "Изтрий", en: "Delete" },
  "inventory.deleteConfirm": {
    bg: 'Изтриване на "{name}"?',
    en: 'Delete "{name}"?',
  },
  "inventory.barcodeLabel": { bg: "Баркод", en: "Barcode" },
  "inventory.productsCount": {
    bg: "{count} продукт(а) в каталога",
    en: "{count} product(s) in catalog",
  },

  // Product form
  "productForm.titleNew": { bg: "Нов продукт", en: "New product" },
  "productForm.titleEdit": { bg: "Редактирай продукт", en: "Edit product" },
  "productForm.barcode": { bg: "Баркод", en: "Barcode" },
  "productForm.barcodePlaceholder": {
    bg: "Сканирай или въведи ръчно",
    en: "Scan or enter manually",
  },
  "productForm.scanned": { bg: "✓ Сканиран", en: "✓ Scanned" },
  "productForm.name": { bg: "Име на продукта *", en: "Product name *" },
  "productForm.namePlaceholder": {
    bg: "напр. American Crew Forming Cream",
    en: "e.g. American Crew Forming Cream",
  },
  "productForm.brand": { bg: "Бранд *", en: "Brand *" },
  "productForm.brandPlaceholder": {
    bg: "напр. American Crew",
    en: "e.g. American Crew",
  },
  "productForm.category": { bg: "Категория", en: "Category" },
  "productForm.categoryPlaceholder": {
    bg: "напр. Помада, Восък, Брада…",
    en: "e.g. Pomade, Wax, Beard…",
  },
  "productForm.costPrice": {
    bg: "Закупна цена * (от дистрибутор)",
    en: "Cost price * (from supplier)",
  },
  "productForm.retailPrice": {
    bg: "Продажна цена * (за клиент)",
    en: "Retail price * (to client)",
  },
  "productForm.commissionPct": {
    bg: "Комисионна за бръснаря (%)",
    en: "Commission for barber (%)",
  },
  "productForm.commissionHelp": {
    bg: "Каква част от продажната цена получава бръснарят",
    en: "What portion of retail the barber receives",
  },
  "productForm.stockQty": { bg: "Брой на склад *", en: "Stock quantity *" },
  "productForm.lowStockThreshold": {
    bg: "Критичен запас (под който напомняме за поръчка)",
    en: "Low stock threshold (when to remind to reorder)",
  },
  "productForm.markup": {
    bg: "Печалба на бройка: {amount} {currency}",
    en: "Profit per unit: {amount} {currency}",
  },
  "productForm.cancel": { bg: "Отказ", en: "Cancel" },
  "productForm.save": { bg: "💾 Запази", en: "💾 Save" },

  "products.outOfStockAlert": {
    bg: "Няма наличност от този продукт",
    en: "This product is out of stock",
  },
  "products.lowStockHint": {
    bg: "Остават {count} бр.",
    en: "{count} units left",
  },

  // Clients page
  "clients.title": { bg: "Клиенти", en: "Clients" },
  "clients.subtitle": {
    bg: "База с клиенти, история и бързи контакти",
    en: "Client database, history and quick contact",
  },
  "clients.count": { bg: "{count} клиента", en: "{count} clients" },
  "clients.addButton": { bg: "+ Нов клиент", en: "+ New client" },
  "clients.searchPlaceholder": {
    bg: "Търси по име, телефон или имейл…",
    en: "Search by name, phone or email…",
  },
  "clients.empty": {
    bg: "Все още няма клиенти. Добави първия си клиент.",
    en: "No clients yet. Add your first one.",
  },
  "clients.noMatch": {
    bg: "Няма клиенти, отговарящи на търсенето.",
    en: "No clients match your search.",
  },
  "clients.visitsCount": { bg: "{count} посещения", en: "{count} visits" },
  "clients.singleVisit": { bg: "{count} посещение", en: "{count} visit" },
  "clients.totalSpent": { bg: "{amount} {currency}", en: "{amount} {currency}" },
  "clients.lastVisit": { bg: "Последно: {date}", en: "Last: {date}" },
  "clients.noVisits": { bg: "Без посещения", en: "No visits yet" },
  "clients.favoriteBarber": {
    bg: "Предпочитан: {name}",
    en: "Favorite: {name}",
  },
  "clients.action.call": { bg: "Обади се", en: "Call" },
  "clients.action.sms": { bg: "SMS", en: "SMS" },
  "clients.action.email": { bg: "Имейл", en: "Email" },
  "clients.action.viber": { bg: "Viber", en: "Viber" },
  "clients.action.whatsapp": { bg: "WhatsApp", en: "WhatsApp" },
  "clients.action.edit": { bg: "Редактирай", en: "Edit" },
  "clients.action.delete": { bg: "Изтрий", en: "Delete" },
  "clients.deleteConfirm": {
    bg: 'Изтриване на клиент "{name}"?',
    en: 'Delete client "{name}"?',
  },
  "clients.barberOnlyWarning": {
    bg: "Бръснарите не могат да виждат клиентския списък.",
    en: "Barbers cannot view the client list.",
  },

  // Client form
  "clientForm.titleNew": { bg: "Нов клиент", en: "New client" },
  "clientForm.titleEdit": { bg: "Редактирай клиент", en: "Edit client" },
  "clientForm.firstName": { bg: "Име *", en: "First name *" },
  "clientForm.lastName": { bg: "Фамилия", en: "Last name" },
  "clientForm.phone": { bg: "Телефон *", en: "Phone *" },
  "clientForm.email": { bg: "Имейл", en: "Email" },
  "clientForm.notes": { bg: "Бележки", en: "Notes" },
  "clientForm.notesPlaceholder": {
    bg: "напр. алергия, любим стил, рожден ден…",
    en: "e.g. allergies, favorite style, birthday…",
  },
  "clientForm.cancel": { bg: "Отказ", en: "Cancel" },
  "clientForm.save": { bg: "💾 Запази", en: "💾 Save" },

  // Team page
  "team.title": { bg: "Екип", en: "Team" },
  "team.subtitle": {
    bg: "Управление на бръснарите, работно време и специалности",
    en: "Manage barbers, working hours and specialties",
  },
  "team.count": { bg: "{count} бръснари", en: "{count} barbers" },
  "team.addButton": { bg: "+ Нов бръснар", en: "+ New barber" },
  "team.searchPlaceholder": {
    bg: "Търси по име или специалност…",
    en: "Search by name or specialty…",
  },
  "team.empty": {
    bg: "Все още няма добавени бръснари.",
    en: "No barbers added yet.",
  },
  "team.noMatch": {
    bg: "Няма бръснари, отговарящи на търсенето.",
    en: "No barbers match your search.",
  },
  "team.workHours": { bg: "Работно време", en: "Working hours" },
  "team.location": { bg: "Локация", en: "Location" },
  "team.specialties": { bg: "Специалности", en: "Specialties" },
  "team.rating": { bg: "Рейтинг", en: "Rating" },
  "team.reviews": { bg: "{count} ревюта", en: "{count} reviews" },
  "team.deleteConfirm": {
    bg: 'Премахване на "{name}" от екипа?',
    en: 'Remove "{name}" from the team?',
  },

  // Team form
  "teamForm.titleNew": { bg: "Нов бръснар", en: "New barber" },
  "teamForm.titleEdit": { bg: "Редактирай бръснар", en: "Edit barber" },
  "teamForm.name": { bg: "Име и фамилия *", en: "Full name *" },
  "teamForm.namePlaceholder": { bg: "напр. Иван Петров", en: "e.g. John Smith" },
  "teamForm.titleField": { bg: "Длъжност", en: "Title" },
  "teamForm.titleFieldPlaceholder": {
    bg: "напр. Senior Barber",
    en: "e.g. Senior Barber",
  },
  "teamForm.location": { bg: "Локация *", en: "Location *" },
  "teamForm.workStart": { bg: "Начало (час) *", en: "Start (hour) *" },
  "teamForm.workEnd": { bg: "Край (час) *", en: "End (hour) *" },
  "teamForm.specialties": {
    bg: "Специалности (разделени със запетая)",
    en: "Specialties (comma-separated)",
  },
  "teamForm.specialtiesPlaceholder": {
    bg: "напр. Fade, Брада, Класика",
    en: "e.g. Fade, Beard, Classic",
  },
  "teamForm.cancel": { bg: "Отказ", en: "Cancel" },
  "teamForm.save": { bg: "💾 Запази", en: "💾 Save" },

  // Settings page
  "settings.title": { bg: "Настройки", en: "Settings" },
  "settings.subtitle": {
    bg: "Персонализирай BarberOS според своите предпочитания",
    en: "Customize BarberOS to your preferences",
  },
  "settings.theme.title": { bg: "🌗 Тема", en: "🌗 Theme" },
  "settings.theme.subtitle": {
    bg: "Тъмна, светла или автоматично според устройството",
    en: "Dark, light, or automatic based on your device",
  },
  "settings.theme.light": { bg: "Светла", en: "Light" },
  "settings.theme.dark": { bg: "Тъмна", en: "Dark" },
  "settings.theme.system": { bg: "Системна", en: "System" },
  "settings.account.title": { bg: "🏢 Профил на бизнеса", en: "🏢 Business profile" },
  "settings.account.subtitle": {
    bg: "Име и контактна информация на салона",
    en: "Salon name and contact details",
  },
  "settings.account.businessName": {
    bg: "Име на бизнеса",
    en: "Business name",
  },
  "settings.account.email": { bg: "Имейл за връзка", en: "Contact email" },
  "settings.account.phone": { bg: "Телефон", en: "Phone" },
  "settings.account.saveSoon": {
    bg: "Скоро ще можеш да запазваш промените",
    en: "Coming soon: ability to save changes",
  },
  "settings.notifications.title": {
    bg: "🔔 Известия",
    en: "🔔 Notifications",
  },
  "settings.notifications.subtitle": {
    bg: "Email и SMS известия за теб и клиентите",
    en: "Email and SMS notifications for you and clients",
  },
  "settings.subscription.title": {
    bg: "💳 Абонамент",
    en: "💳 Subscription",
  },
  "settings.subscription.subtitle": {
    bg: "Платежни данни и план",
    en: "Billing details and plan",
  },
  "settings.danger.title": { bg: "⚠️ Опасна зона", en: "⚠️ Danger zone" },
  "settings.danger.logout": { bg: "Изход от акаунта", en: "Sign out" },
  "settings.danger.resetDemo": {
    bg: "Изчисти демо данните",
    en: "Clear demo data",
  },
  "settings.danger.resetConfirm": {
    bg: "Сигурен ли си, че искаш да изтриеш всички локални данни? Действието не може да се отмени.",
    en: "Are you sure you want to clear all local data? This cannot be undone.",
  },
  "settings.danger.resetDone": {
    bg: "Демо данните са изчистени.",
    en: "Demo data has been cleared.",
  },
  "settings.placeholder.soon": { bg: "Скоро", en: "Coming soon" },

  // Booking link section
  "settings.bookingLink.title": {
    bg: "🔗 Линк за резервации",
    en: "🔗 Booking link",
  },
  "settings.bookingLink.subtitle": {
    bg: "Сподели този линк или QR код с клиентите си",
    en: "Share this link or QR code with your clients",
  },
  "settings.bookingLink.copy": { bg: "Копирай", en: "Copy" },
  "settings.bookingLink.copied": { bg: "✓ Копирано", en: "✓ Copied" },
  "settings.bookingLink.openQr": { bg: "📱 Покажи QR", en: "📱 Show QR" },
  "settings.bookingLink.qrTitle": {
    bg: "QR код за твоя салон",
    en: "QR code for your salon",
  },
  "settings.bookingLink.qrHint": {
    bg: "Клиентите сканират → отварят се на страницата за резервация",
    en: "Clients scan → they land on the booking page",
  },
  "settings.bookingLink.print": { bg: "🖨️ Принтирай", en: "🖨️ Print" },
  "settings.bookingLink.close": { bg: "Затвори", en: "Close" },
} as const satisfies Record<string, LocalizedString>;

export type TranslationKey = keyof typeof translations;
