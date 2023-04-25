export function CookieParser() {

   let cookie = document ? document.cookie : undefined;

   if (!cookie || typeof cookie === "undefined") {
      return;
   }

   const cookies = {};
   cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.split('=').map(c => c.trim());
      cookies[name] = value;
   });
   return cookies;
}

export function deleteCookie(cookieName) {
   if (!cookieName) return;
   return document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

export const authLogout = async () => {
   const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/auth/sign-out`, {
      method: "POST",
      withCredentials: true,
      credentials: "include",
   });
   if (response.ok) {
      deleteAuth();
      window.location.reload();
   }
};

export const slugMaker = (string) => {
   return string.toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^\w-]+/g, '').trim();
}

export const emailValidator = (email) => {
   const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(String(email).toLowerCase());
}

export const camelToTitleCase = (str) => {
   if (!str) {
      return false;
   }

   let newStr = str.replace(/([A-Z])/g, " $1");

   return newStr.charAt(0).toUpperCase() + newStr.slice(1);
}

export const textToTitleCase = (str) => {

   if (!str) {
      return false;
   }

   let newStr = str.split(/[-]|[_]|[A-Z]/g);

   let finalStr = "";

   for (let i = 0; i < newStr.length; i++) {
      finalStr += newStr[i].charAt(0).toUpperCase() + newStr[i].slice(1) + " ";
   }

   return finalStr.trim();
}

export const calcTime = (iso, offset) => {

   let date = new Date(iso);

   let utc = date.getTime() + (date.getTimezoneOffset() * 60000);

   let nd = new Date(utc + (3600000 * offset));

   return nd?.toLocaleTimeString();
}

export async function apiHandler(url = "", method = "GET", body = {}, authorization = "") {

   const { log_tok } = CookieParser();

   const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1${url}`, {
      method,
      withCredentials: true,
      credentials: "include",
      headers: {
         "Content-Type": "application/json",
         authorization: `Bearer ${log_tok || ""}`
      },
      body: JSON.stringify(body)
   });

   const result = await response.json();

   if (response.status === 401) {
      await authLogout();
      deleteAuth();
      localStorage.removeItem("client_data");
      return;
   }

   if (result) {
      return result;
   }
}



export function addCookies(name, value, age) {
   let now = new Date();

   const expireTime = new Date(now.getTime() + parseFloat(age) * 60 * 60 * 1000);

   document.cookie = `${name}=${value}; max-age=${(expireTime.getTime() - now.getTime()) / 1000}; path=/`;
   return true;
}

export function deleteAuth() {
   deleteCookie("_uuid");
   deleteCookie("log_tok");
   localStorage.removeItem("client_data");
   return true;
}


export function calculateShippingCost(volWeight, areaType) {
   let n = 0; // price initial 0.5 kg = 0.5 dollar
   let charge;
   let arr = [];

   if (volWeight <= 3) {
      charge = areaType === "local" ? 0.5 : areaType === "zonal" ? 0.8 : 0.8;
   }
   else if (volWeight > 3 && volWeight <= 8) {
      charge = areaType === "local" ? 0.4 : areaType === "zonal" ? 0.7 : 0.7;
   }
   else if (volWeight > 8) {
      charge = areaType === "local" ? 0.3 : areaType === "zonal" ? 0.5 : 0.5;
   }

   do {
      n += 0.5;
      arr.push(n);
   } while (n < volWeight);

   let count = arr.length;

   let sum = (count * charge).toFixed(0);
   return parseInt(sum);
}