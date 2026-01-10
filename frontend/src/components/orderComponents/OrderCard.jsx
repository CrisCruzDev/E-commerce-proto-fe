import { Clock } from 'lucide-react';

const OrderCard = ({ order }) => {
  return (
    <div className='border border-black bg-white shadow-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-200'>
      {/* ORDER HEADER */}
      <div className='bg-gray-50 border-b border-black/10 p-4 flex flex-col md:flex-row justify-between md:items-center gap-3 md:gap-16'>
        <div className='flex flex-col gap-1'>
          <span className='font-mono text-[10px] text-gray-500 uppercase tracking-widest'>
            Order ID
          </span>
          <span className='font-mono text-xs font-bold text-black'>
            #{order._id}
          </span>
        </div>

        <div className='flex flex-col gap-1'>
          <span className='font-mono text-[10px] text-gray-500 uppercase tracking-widest'>
            Date Placed
          </span>
          <span className='font-mono text-xs font-bold'>
            {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className='flex flex-col gap-1'>
          {/* <span className='font-mono text-[10px] text-gray-500 uppercase tracking-widest'>
            Total Amount
          </span>
          <span className='font-bebas text-xl text-black'>
            ${order.totalPrice.toFixed(2)}
          </span> */}
        </div>

        <div className='md:ml-auto'>
          <span
            className={`
             inline-flex items-center gap-2 px-3 py-1 border text-[10px] font-bold uppercase tracking-wider
             ${
               order.isPaid
                 ? 'bg-green-50 border-green-200 text-green-700'
                 : 'bg-yellow-50 border-yellow-200 text-yellow-700'
             }
           `}
          >
            {order.isPaid ? 'Payment Successful' : 'Pending Payment'}
          </span>
        </div>
      </div>

      {/* ORDER ITEMS LIST */}
      <div className='divide-y divide-gray-100'>
        {order.orderItems.map((item, index) => (
          <div key={index} className='p-4 flex gap-4 items-center'>
            {/* Image */}
            <div className='w-16 h-16 flex-shrink-0 border border-gray-200 bg-gray-50 p-1'>
              <img
                src={item.image}
                alt={item.name}
                className='w-full h-full object-contain mix-blend-multiply'
              />
            </div>

            {/* Item Details */}
            <div className='flex-1 min-w-0'>
              <h4 className='font-bebas text-lg truncate text-black leading-none mb-1'>
                {item.name}
              </h4>
              <p className='font-mono text-[10px] text-gray-500'>
                QTY: {item.qty} × ${item.price.toFixed(2)}
              </p>
            </div>

            {/* Total Line Item Price */}
            <div className='font-mono text-sm font-bold'>
              ${(item.qty * item.price).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* FOOTER / SHIPPING INFO */}
      <div className='p-3 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center'>
        <div className='flex items-center gap-2 text-gray-400'>
          <Clock size={14} />
          <span className='font-mono text-[10px] uppercase'>
            Status: success
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <p className='font-mono text-[10px]'>total:</p>
          <span className='font-bebas text-md text-black'>
            ${order.totalPrice.toFixed(2)}
          </span>
        </div>

        {/* Optional: Add a 'View Details' button if you build a detailed single order page later */}
        {/* <button className="text-[10px] font-bold uppercase underline flex items-center gap-1">
          View Invoice <ArrowRight size={12} />
        </button> */}
      </div>
    </div>
  );
};

export default OrderCard;
