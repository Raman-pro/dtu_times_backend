# DTU Times Edition API Docs

Base URL: ``

---

## Endpoints

### 1. `GET` Methods

**GET** `/editions`

**Query Params (optional):**

- `search` → filter editions by name, createdAt, or updatedAt
- `sortBy` → `"editionid" | "createdat" | "updatedat"`
- `order` → `"a"` (ascending) or `"d"` (descending) {default}
- `pageNo` → allows pagenation
- `records` → tells how many records to display (works with pageNo) has default value 5

**GET** `/editions/:id`

- returns the edition with the given id

### 2. `POST` Method

**POST** `/editions`

body that can be passed:

- `name` (required)
- `status` (required)
- `edition_link` (required)
- `published_at` (optional)
- `thumbnail` (required)

### 3. `PUT` Method

**PUT** `/editions/:id`

body that can be passed:

- `name` (optional)
- `status` (optional)
- `edition_link` (optional)
- `published_at` (optional)
- `thumbnail` (optional)

### 4. `DELETE` Method

**DELETE** `/editions/:id`

Further features of the backend:

- The app is using synchorous (which in my opinion is best for a site like DTU Times) design intentionally first of all an outer veriable db is declared which reads and stores the data of db.json so if any number of users request using GET method there is no i/o operation needed.
- If a user is making POST/PUT/DELETE Request all the incoming requests will be paused till the operation is completed (so that user gets updated info only) as The editions would be updated quaterly synchorous approach would be a better solution for DTU Times.
- Moreover if someone has posted something wrong when deleted the other incoming requests would be held before the delete is performed.

- Furthermore, the app uses validator also
- The app also sends correct status for each extreme case
