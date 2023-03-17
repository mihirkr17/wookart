export const authLogout = async () => {
   const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/auth/sign-out`, {
      method: "POST",
      withCredentials: true,
      credentials: "include",
   });
   if (response.ok) {
      localStorage.removeItem("u_data");
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

   const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1${url}`, {
      method,
      withCredentials: true,
      credentials: "include",
      headers: {
         "Content-Type": "application/json",
         authorization
      },
      body: JSON.stringify(body)
   });

   if (response.status === 401) {
      await authLogout();
      return;
   }

   const result = await response.json();

   if (result) {
      return result;
   }
}

export function CookieParser(cookie) {

   if (!cookie || typeof cookie === "undefined") {
      return { error: "Required cookie !" }
   }

   let cookies = {};

   cookie = cookie?.split(";").filter(e => e) || [];

   for (let i = 0; i < cookie.length; i++) {
      let [key, value] = cookie[i]?.replace(/[=+]/gi, ":")?.split(":");
      cookies[key.trim()] = value.trim();
   }

   return cookies;
}