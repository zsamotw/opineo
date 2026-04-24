import { Opinion } from "./opinions";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export const mockOpinions: Opinion[] = [
  {
    id: generateId(),
    user: { name: "Katarzyna Wojciechowska", avatar: null },
    date: "2025-03-18T14:30:00Z",
    content: "Demokratyczne instytucje w Polsce wymagają głębokiej reformy, a nie kosmetycznych zmian. Problemy wynikające z konstytucyjnych ograniczeń kadencyjności, słabości sądownictwa oraz rosnącej polaryzacji mediów publicznych nie zostaną rozwiązane przez kolejne change'y w ramach obecnego systemu. Potrzebujemy rzeczywistej debaty o modelu ustrojowym, a nie tylko wymianie ludzi na stanowiskach. Koniec z iluzją, że same wybory wystarczą do funkcjonowania demokracji, gdy instytucje są systematycznie osłabiane przez wszystkie opcje polityczne.",
    comments: [
      {
        id: generateId(),
        user: { name: "Michał Rutkowski", avatar: null },
        date: "2025-03-18T15:45:00Z",
        agree: "Trafnie zauważasz fundamentalny problem polskiej demokracji. Konstantytucja z 1997 roku była kompromisem ówczesnych sił politycznych i nie nadąża za zmianami społecznymi. Problem kadencyjności jest symptomem głębszego kryzysu legitymizacji władzy sądowniczej i rosnącej nieufności obywateli do instytucji państwowych.",
        disagree: "Proponujesz rewolucję systemową w momencie, gdy większość obywateli jest zadowolona z funkcjonowania demokracji. Reformy konstytucyjne wymagają szerokiego konsensusu społecznego.",
        selectedQuote: "Problemy wynikające z konstytucyjnych ograniczeń kadencyjności",
        replies: [
          {
            id: generateId(),
            user: { name: "Katarzyna Wojciechowska", avatar: null },
            date: "2025-03-18T16:30:00Z",
            agree: "Rozumiem Twoją ostrożność wobec zmian konstytucyjnych, ale historia pokazuje, że reformy systemowe są możliwe.",
            disagree: "Kraje skandinawskie mają zupełnie inną historię i kulturę polityczną.",
            reactions: [
              { type: "appreciate", userId: "user2" },
              { type: "connect", userId: "user3" },
            ],
          },
        ],
        reactions: [
          { type: "appreciate", userId: "user2" },
          { type: "connect", userId: "user3" },
        ],
      },
      {
        id: generateId(),
        user: { name: "Paweł Kamiński", avatar: null },
        date: "2025-03-18T18:20:00Z",
        agree: "Twoja diagnoza jest trafna, ale proponowane rozwiązania są zbyt ogólnikowe.",
        disagree: "Twoja wypowiedź jest typowym przykładem nihilizmu politycznego.",
        selectedQuote: "a nie tylko wymianie ludzi na stanowiskach",
        replies: [
          {
            id: generateId(),
            user: { name: "Katarzyna Wojciechowska", avatar: null },
            date: "2025-03-18T19:00:00Z",
            agree: "Masz rację, że konkretne propozycje są potrzebne.",
            disagree: "Proponujesz rozwiązania, które brzmią dobrze w teorii.",
            reactions: [
              { type: "appreciate", userId: "user4" },
              { type: "changed", userId: "user5" },
            ],
          },
        ],
        reactions: [
          { type: "appreciate", userId: "user4" },
        ],
      },
    ],
    reactions: [
      { type: "appreciate", userId: "user2" },
      { type: "connect", userId: "user3" },
    ],
  },
  {
    id: generateId(),
    user: { name: "Tomasz Lewandowski", avatar: null },
    date: "2025-03-12T09:15:00Z",
    content: "Polityka migracyjna Polski jest fundamentalnym błędem strategicznym. Zamykanie się na imigrantów ekonomicznych jest hipokryzją. Potrzebujemy etapowej, przemyślanej polityki integracyjnej.",
    comments: [
      {
        id: generateId(),
        user: { name: "Ewa Kowalska", avatar: null },
        date: "2025-03-12T10:30:00Z",
        agree: "Twoja analiza demograficzna jest bezlitośnie prawdziwa.",
        disagree: "Twoja argumentacja opiera się na fałszywej dychotomii.",
        selectedQuote: "Zamykanie się na imigrantów ekonomicznych jest hipokryzją",
        replies: [
          {
            id: generateId(),
            user: { name: "Tomasz Lewandowski", avatar: null },
            date: "2025-03-12T11:15:00Z",
            agree: "Zgadzam się, że automatyzacja jest ważna, ale nie jest alternatywą dla migracji.",
            disagree: "To typowa wymówka dla braku odwagi politycznej.",
            reactions: [
              { type: "appreciate", userId: "user6" },
            ],
          },
        ],
        reactions: [
          { type: "connect", userId: "user7" },
        ],
      },
      {
        id: generateId(),
        user: { name: "Anna Wiśniewska", avatar: null },
        date: "2025-03-12T12:45:00Z",
        agree: "Jednoznacznie popieram potrzebę kompleksowej polityki migracyjnej.",
        disagree: "Porównywanie dzisiejszej sytuacji do tej z lat 90. jest nieporozumieniem.",
        replies: [],
        reactions: [
          { type: "appreciate", userId: "user8" },
          { type: "changed", userId: "user9" },
        ],
      },
    ],
    reactions: [
      { type: "appreciate", userId: "user6" },
      { type: "connect", userId: "user7" },
    ],
  },
  {
    id: generateId(),
    user: { name: "Monika Dąbrowska", avatar: null },
    date: "2025-03-08T11:20:00Z",
    content: "System ochrony zdrowia w Polsce jest na granicy katastrofy. Problem nie polega na pieniądzach, ale na fundamentalnym błędzie w organizacji systemu.",
    comments: [
      {
        id: generateId(),
        user: { name: "Jarosław Wróbel", avatar: null },
        date: "2025-03-08T12:40:00Z",
        agree: "Twoja diagnoza jest bolesnie trafna, ale proponowane rozwiązania są nierealistyczne.",
        disagree: "Problem nie jest w pieniądzach ani organizacji, ale w mentalności.",
        selectedQuote: "kolejki do specjalistów wydłużają się systematycznie",
        replies: [
          {
            id: generateId(),
            user: { name: "Monika Dąbrowska", avatar: null },
            date: "2025-03-08T13:25:00Z",
            agree: "Masz rację co do współpłacenia w innych krajach.",
            disagree: "To jest właśnie polskie podejście - znajdujemy wymówki.",
            reactions: [
              { type: "appreciate", userId: "user10" },
            ],
          },
        ],
        reactions: [
          { type: "appreciate", userId: "user10" },
          { type: "connect", userId: "user11" },
        ],
      },
      {
        id: generateId(),
        user: { name: "Agnieszka Adamska", avatar: null },
        date: "2025-03-08T14:50:00Z",
        agree: "Jako osoba pracująca w systemie, mogę potwierdzić, że sytuacja jest jeszcze gorsza.",
        disagree: "Twoja wypowiedź jest jednostronna.",
        replies: [],
        reactions: [
          { type: "appreciate", userId: "user12" },
        ],
      },
    ],
    reactions: [
      { type: "appreciate", userId: "user10" },
      { type: "connect", userId: "user11" },
    ],
  },
];