"use client";

import {
  TrendingUp,
  TrendingDown,
  Activity
} from "lucide-react";


export default function DashboardUtils({
  data = []
}) {


const masuk = data.filter(
  item =>
    item.jenis_transaksi?.toLowerCase() === "masuk" ||
    item.jenis_transaksi?.toLowerCase() === "pemasukan"
).length;



const keluar = data.filter(
  item =>
    item.jenis_transaksi?.toLowerCase() === "keluar" ||
    item.jenis_transaksi?.toLowerCase() === "pengeluaran"
).length;



const cards = [

{
title:"Transaksi Masuk",
value:masuk,
icon:TrendingUp,
iconBg:"bg-emerald-50",
iconColor:"text-emerald-600"
},

{
title:"Transaksi Keluar",
value:keluar,
icon:TrendingDown,
iconBg:"bg-red-50",
iconColor:"text-red-600"
},

{
title:"Aktivitas",
value:data.length,
icon:Activity,
iconBg:"bg-blue-50",
iconColor:"text-blue-600"
}

];



return (

<div

className="
grid
grid-cols-1
md:grid-cols-3
gap-5
"

>


{
cards.map((card,index)=>{


const Icon = card.icon;


return (

<div

key={index}

className="
bg-white
rounded-2xl
border
border-gray-100
shadow-sm
p-5
hover:shadow-md
transition
"

>


<div

className="
flex
items-center
justify-between
"

>


<div>


<p

className="
text-sm
text-gray-500
font-medium
"

>
{card.title}
</p>



<h3

className="
text-2xl
font-bold
text-gray-800
mt-2
"

>

{card.value}

</h3>


</div>




<div

className={`
w-11
h-11
rounded-xl
flex
items-center
justify-center
${card.iconBg}
`}

>


<Icon

size={23}

className={card.iconColor}

/>


</div>




</div>


</div>


)

})

}



</div>


);

}